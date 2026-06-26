# アーキテクチャ概要

## 全体構成

```
ブラウザ
  └── Next.js 15 (App Router)
        ├── Server Components   ← ページファイル (page.tsx / template.tsx)
        │                         薄いラッパー。データ取得は行わない。
        └── Client Components   ← *PageContent.tsx + hooks
              ├── AWS Cognito (認証)
              └── Backend API (FastAPI)
                    ├── REST/JSON  ← axios + Orval 生成クライアント
                    ├── SSE        ← Fetch Streaming (チャットメッセージ)
                    └── WebSocket  ← WebSocketCall クラス (将来用途)
```

## レンダリング戦略

| 種別             | ファイルパターン                              | 役割                                                                          |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| Server Component | `src/app/**/page.tsx`                         | ページのエントリポイント。Client Component をラップするのみ。                 |
| Client Component | `src/components/features/**/*PageContent.tsx` | 全インタラクション・データ取得・表示ロジックを担当。`'use client'` 宣言必須。 |
| Server Action    | `src/lib/auth/logout.ts`                      | Cookie 削除（ログアウト処理）のみ。                                           |

Server Component でのデータプリフェッチ（`fetch` in page.tsx）は現時点では実装されていない。全データ取得はクライアントサイドの `useEffect` 内で行われる。

## データフロー

```
ページ表示
  1. page.tsx (Server Component) → *PageContent をレンダリング
  2. *PageContent (Client Component) マウント
  3. useEffect → カスタムフック内の fetch 関数を呼び出す
  4. api.xxx() → axios → Backend API
  5. レスポンスを useState にセット → 再レンダリング

チャットメッセージ送信
  1. ユーザーがテキスト送信
  2. useChat.sendMessage() → streamChatMessageApiV1ChatMessageConversationIdPost()
  3. Fetch API で SSE ストリーム受信
  4. onChunk コールバック → setMessages で AI バブルを逐次更新
  5. onComplete → isSending を false に
```

## 状態管理

グローバル状態ライブラリ（Zustand・Redux・Recoil）は**使用していない**。

すべての状態は機能単位のカスタムフック内の `useState` で管理される。コンポーネント間の状態共有は props 経由のみ。詳細は [state-management.md](state-management.md) を参照。

## API 通信

| 通信方式           | 実装                                | 用途                         |
| ------------------ | ----------------------------------- | ---------------------------- |
| REST/JSON          | `src/lib/api/mutator.ts` (axios)    | 全 CRUD・検索・マッチング    |
| SSE ストリーミング | `src/lib/api/stream.ts` (Fetch API) | チャットメッセージの AI 応答 |
| WebSocket          | `src/lib/api/websocket.ts`          | 実装済み・現時点では未使用   |

全 REST エンドポイントは Orval が OpenAPI spec から自動生成したクライアントを使用する。手動実装はストリーミングのみ。詳細は [api-integration.md](api-integration.md) を参照。

## 認証

AWS Cognito を EMAIL_OTP（パスワードレス）フローで使用。

- サインアップ: メールアドレス登録 → 確認コード入力
- ログイン: メール送信 → OTP 入力
- トークン: Cognito セッション（`aws-amplify`管理）
- API 認可: axios インターセプターが `fetchAuthSession()` で JWT を取得し `Authorization: Bearer` ヘッダーに付与

## 設計思想

- **ページは薄く**: `page.tsx` は `*PageContent` をレンダリングするだけ
- **ロジックはフックへ**: API 呼び出し・ローカル状態・エラーハンドリングはカスタムフックに集約
- **型は自動生成**: API の型は Orval が生成するため、手動の型定義と乖離しない
- **コンポーネントの階層**: atoms → molecules → templates の順に依存。上位から下位を参照してはならない
