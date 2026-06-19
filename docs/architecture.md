# アーキテクチャ概要

## 全体構成

```
ブラウザ
  └── Next.js 15 (App Router)
        ├── Server Components   ← ページファイル (page.tsx / template.tsx)
        │                         薄いラッパー。データ取得は行わない。
        └── Client Components   ← *PageContent.tsx + hooks
              ├── AWS Cognito (認証・認可)
              └── Backend API (FastAPI)
                    ├── REST/JSON  ← axios + Orval 生成クライアント
                    ├── SSE        ← Fetch Streaming (チャットメッセージ)
                    └── WebSocket  ← WebSocketCall クラス (将来用途)
```

## ユーザーロール

| ロール | 説明 | 主な画面 |
|---|---|---|
| Dreamer（生徒） | 仮の夢を発見し、補助教材を受け取る | `/job/*`, `/chat/*`, `/dream-action/*` |
| Mentor（教員） | クラス・生徒を管理し、補助教材を生成・配布する | `/mentor/*` |

ロールは JWT の `cognito:groups` クレーム（`["mentor"]` または `["dreamer"]`）から判定。フォールバックとして `custom:role` カスタム属性も参照。

## レンダリング戦略

| 種別 | ファイルパターン | 役割 |
|---|---|---|
| Server Component | `src/app/**/page.tsx` | ページのエントリポイント。Client Component をラップするのみ。 |
| Client Component | `src/components/features/**/*PageContent.tsx` | 全インタラクション・データ取得・表示ロジックを担当。`'use client'` 宣言必須。 |
| Server Action | `src/lib/auth/logout.ts` | Cookie 削除（ログアウト処理）のみ。 |

Server Component でのデータプリフェッチ（`fetch` in page.tsx）は現時点では実装されていない。全データ取得はクライアントサイドの `useEffect` 内で行われる。

## データフロー

```
ページ表示
  1. page.tsx (Server Component) → *PageContent をレンダリング
  2. *PageContent (Client Component) マウント
  3. useEffect → API 関数を呼び出す
  4. api.xxx() → axios → Backend API (または mock 関数)
  5. レスポンスを useState にセット → 再レンダリング

チャットメッセージ送信
  1. ユーザーがテキスト送信
  2. useChat.sendMessage() → streamChatMessageApiV1ChatMessageConversationIdPost()
  3. Fetch API で SSE ストリーム受信
  4. onChunk コールバック → setMessages で AI バブルを逐次更新
  5. onComplete → isSending を false に

Dream Action 補助教材生成（Mentor）
  1. 教員が授業資料フォルダを選択し「生成開始」
  2. generateDreamAction(classId, folderId) → API（現在はモック）
  3. 生徒全員のステータスを 'generating' に設定
  4. 3秒後 completeDreamActionBatch() で 'completed' に更新
  5. 教員が内容確認後 distributeDreamAction(materialId) を呼び出す
  6. ステータスが 'distributed' に → 生徒側に配信
```

## 状態管理

グローバル状態ライブラリ（Zustand・Redux・Recoil）は**使用していない**。

すべての状態は機能単位のカスタムフック内の `useState` で管理される。コンポーネント間の状態共有は props 経由のみ。詳細は [state-management.md](state-management.md) を参照。

## API 通信

| 通信方式 | 実装 | 用途 |
|---|---|---|
| REST/JSON | `src/lib/api/mutator.ts` (axios) | 全 CRUD・検索・マッチング（Orval 生成） |
| SSE ストリーミング | `src/lib/api/stream.ts` (Fetch API) | チャットメッセージの AI 応答 |
| WebSocket | `src/lib/api/websocket.ts` | 実装済み・現時点では未使用 |
| Mock 関数 | `src/lib/api/gen/mentor/*`, `src/lib/api/gen/dreamAction/*` | Mentor/Dream Action API（バックエンド未実装のためモック） |

### API ディレクトリ構成

```
src/lib/api/
  gen/
    chat/         ← Orval 生成
    job/          ← Orval 生成
    dreamer/      ← Orval 生成
    matching/     ← Orval 生成
    onboarding/   ← Orval 生成
    mentor/
      classes.ts  ← モック（クラス管理）
      materials.ts← モック（授業資料）
    dreamAction/
      dreamAction.ts ← モック（Dream Action）
  mock/
    mentorMockData.ts         ← Mentor 用モックデータ
    dreamerDreamActionMockData.ts ← Dreamer 用モックデータ
```

## 認証

AWS Cognito を EMAIL_OTP（パスワードレス）フローで使用。

- サインアップ: メールアドレス登録 → 確認コード入力
- ログイン: メール送信 → OTP 入力
- トークン: Cognito セッション（`aws-amplify` 管理）
- API 認可: `src/lib/api/mutator.ts` の axios インターセプターが `fetchAuthSession()` で JWT を取得し `Authorization: Bearer` ヘッダーに付与

### ロール判定

```ts
// JWT idToken のペイロードから取得
const groups = payload['cognito:groups'] as string[] | undefined
// 例: ["mentor"] or ["dreamer"]
const role = groups?.includes('mentor') ? 'mentor' : 'dreamer'
```

### ルートガード

`src/middleware.ts` （Next.js Middleware）で実装。

- 保護対象パス: `/job/*`, `/chat/*`, `/dream-action/*`, `/mentor/*`
- Mentor 限定パス: `/mentor/*`
- 認証チェック: Amplify v6 Cookie パターン（`CognitoIdentityServiceProvider.{clientId}.*.accessToken`）または `access_token` Cookie
- ロールチェック: `user_role` Cookie（ログイン時にサーバーアクションで設定する想定）

### `useAuthRole` フック

`src/hooks/features/auth/useAuthRole.ts` — 現在ユーザーのロール・ID を取得するフック。各画面でロールに応じた UI 制御に使用。

## 設計思想

- **ページは薄く**: `page.tsx` は `*PageContent` をレンダリングするだけ
- **ロジックはフックへ**: API 呼び出し・ローカル状態・エラーハンドリングはカスタムフックに集約
- **型は自動生成**: Orval 対応 API の型は自動生成。未対応（Mentor/Dream Action）は手動型定義 + モック
- **コンポーネントの階層**: atoms → molecules → templates の順に依存。上位から下位を参照してはならない
- **バックエンド非依存**: Mentor/Dream Action の API 層はモック実装済みのため、バックエンド完成後に差し替えるだけで動作する

## 主要機能一覧

| 機能 | 状態 | 説明 |
|---|---|---|
| Dream Matching | 実装済み | マッチングアプリ風 UI で Dreamer が仮の夢を発見 |
| チャット | 実装済み | AI とのチャット（SSE ストリーミング） |
| Dreamer 管理（Mentor） | 実装済み | 生徒の登録・グループ分け |
| Dream Action（Mentor） | **実装済み（モック）** | 授業資料から補助教材を生成・配布 |
| Dream Action（Dreamer） | **実装済み（モック）** | 配布された補助教材の受信・閲覧 |
| クラス管理 | **実装済み（モック）** | クラス単位の生徒・資料管理 |
| クラス全体管理 | **実装済み（モック）** | Recharts を使った分析ダッシュボード |
| 授業資料フォルダ | **実装済み（モック）** | ファイルアップロード・管理 |
