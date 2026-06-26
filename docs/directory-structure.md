# ディレクトリ構造

## 全体構成

```
karynos-web/
├── .github/
│   └── workflows/
│       └── code-quality.yml     # CI 設定
├── scripts/
│   └── check-api-compat.mjs     # API 互換チェックスクリプト
├── src/
│   ├── app/                     # Next.js App Router
│   ├── components/              # React コンポーネント
│   ├── hooks/                   # カスタムフック
│   ├── lib/                     # ライブラリ・ユーティリティ
│   └── types/                   # 型定義
├── docs/                        # ドキュメント（本ファイルが所属）
├── docker-compose.yml
├── Dockerfile.dev
├── Makefile
├── next.config.ts
├── orval.config.ts
├── openapi.json                 # ローカル OpenAPI スナップショット (自動更新)
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## `src/app/`

**役割**: Next.js App Router のエントリポイント。ルーティング・レイアウトのみを担当。

**編集時の注意**:

- `page.tsx` にビジネスロジックを書かない。`*PageContent` コンポーネントを return するだけにする。
- `layout.tsx` は全ページに適用される。スタイル・共通 UI の変更時に注意。
- グループルート `(routes)/` はURLに影響しない。

```
src/app/
├── (routes)/
│   ├── chat/
│   │   ├── page.tsx                     # チャット一覧
│   │   └── [conversation_id]/
│   │       ├── page.tsx                 # チャット詳細
│   │       └── template.tsx             # チャットテンプレート
│   ├── job/
│   │   ├── match/
│   │   │   ├── page.tsx                 # ジョブマッチング
│   │   │   ├── question/page.tsx        # オンボーディング質問
│   │   │   ├── error.tsx                # エラーバウンダリ
│   │   │   └── loading.tsx              # サスペンスローディング
│   │   ├── search/page.tsx              # 求人検索
│   │   └── detail/[job_id]/page.tsx     # 求人詳細
│   ├── login/page.tsx
│   ├── signup/
│   │   ├── page.tsx
│   │   └── create-account/page.tsx
│   └── mentor/dreamer/                  # メンター管理 (CRUD)
├── favicon.ico
├── globals.css                          # グローバルスタイル
├── layout.tsx                           # ルートレイアウト
└── page.tsx                             # ホーム（デモ画面）
```

---

## `src/components/`

**役割**: React コンポーネント。`ui/` と `features/` の2層で構成。

**依存ルール**:

- `ui/` は `features/` に依存しない
- `features/A/` は `features/B/` に依存しない
- `features/` は `ui/` を参照してよい
- 全コンポーネントは `hooks/` を参照してよい

```
src/components/
├── ui/
│   ├── atoms/          # Button, Input, Text — 最小単位
│   ├── molecules/      # Container, Card, Modal, Animation, CircularProgress
│   └── templates/      # NavBar, SideBar
└── features/
    ├── chat/           # チャット UI
    ├── dreamer/        # オンボーディング (InitQuestionsPageContent)
    ├── job/
    │   ├── detail/     # 求人詳細 UI
    │   ├── match/      # スワイプマッチング UI
    │   └── search/     # 検索 UI
    ├── mentor/         # メンター管理 UI
    └── user/           # 認証・アカウント UI
```

---

## `src/hooks/`

**役割**: データ取得・状態管理・副作用の集約。コンポーネントから API 呼び出しを切り離す。

**編集時の注意**:

- フックは `use` プレフィックス必須
- 1フックにつき1機能の責務（混在させない）
- フック間での状態共有は行わない（状態はフックのライフサイクルに閉じる）

```
src/hooks/features/
├── chat/
│   ├── useChat.ts          # メッセージ一覧・送信・削除
│   └── useChatList.ts      # 会話一覧
├── dreamer/
│   └── useInitQuestions.ts # オンボーディング質問取得
├── job/
│   ├── useDetail.ts        # 求人詳細取得
│   ├── useJobChat.ts       # チャット作成・遷移
│   ├── useJobHistory.ts    # 閲覧履歴
│   ├── useJobMatch.ts      # スワイプマッチング（Framer Motion 含む）
│   └── useSearch.ts        # テキスト検索
└── user/
    ├── useCreateAccount.ts  # Dreamer プロフィール作成
    ├── useLogin.ts          # EMAIL_OTP ログイン
    └── useSignUp.ts         # メール登録
```

---

## `src/lib/`

**役割**: 外部サービス・ライブラリとのインターフェース。フックより下位の層。

```
src/lib/
├── api/
│   ├── client.ts           ← 全エンドポイントを統合した api オブジェクト
│   ├── mutator.ts          ← axios インスタンス + JWT インターセプター
│   ├── stream.ts           ← SSE ストリーミング（Fetch API）
│   ├── websocket.ts        ← WebSocket ユーティリティクラス
│   ├── types.ts            ← 共通型 (ApiResponse, ApiErrorType)
│   └── gen/                ← Orval 自動生成（手動編集禁止）
│       ├── chat/chat.ts
│       ├── dreamer/dreamer.ts
│       ├── job/job.ts
│       ├── onboarding/onboarding.ts
│       ├── matching/matching.ts
│       └── schema/         ← 型定義ファイル群
└── auth/
    ├── amplify.ts          ← Amplify.configure() の呼び出し
    └── logout.ts           ← Server Action: Cookie 削除
```

**`gen/` 編集時の注意**: Orval が `npm run orval` で上書きするため手動変更は消える。ただし `onboarding/` と `matching/` はバックエンドの OpenAPI spec 更新後に再生成されるまで手動ファイルとして維持する。

---

## `src/types/`

**役割**: TypeScript 型定義。Orval 生成スキーマで補えない手動型・UI 型を管理。

```
src/types/
├── api/
│   └── job.ts              # RecommendResponse, JobRecommendation（OpenAPI spec と乖離のある型）
├── common/
│   └── index.ts            # AccountType ('dreamer' | 'mentor')
├── feature/
│   └── chat/
│       └── chat.ts         # Message, ChatUIModel, RoleType
└── ui/
    ├── atoms/
    │   ├── Button.ts       # BaseButtonType, NavType
    │   └── Input.ts        # BaseInputTextType
    ├── atoms/Text.ts       # TagColor
    ├── color.ts            # ColorVariantKey, ColorVariants, LoadingColorVariants
    └── molecules/
        ├── Container.ts    # BaseContainerType, StackContainerType, GridContainerType
        └── Modal.ts        # モーダル型
```

**`src/types/api/job.ts` の注意**: OpenAPI spec の `TopRecommendedJobMatch` がバックエンドの実際のレスポンスと一致していないため手動型で対応している。バックエンド spec 修正後は削除予定。

---

## `scripts/`

**役割**: ビルド・開発補助スクリプト。

| ファイル               | 説明                                                   |
| ---------------------- | ------------------------------------------------------ |
| `check-api-compat.mjs` | OpenAPI spec の破壊的変更検出。`prebuild` で自動実行。 |

---

## `openapi.json`

**役割**: バックエンド OpenAPI spec のローカルスナップショット。

- `npm run build` の `prebuild` 時に `scripts/check-api-compat.mjs` が自動更新する
- 破壊的変更なしの場合のみ更新される（破壊的変更があるとビルド失敗）
- **コミット対象**: バックエンドとの契約として git で管理する

---

## `Makefile`

**役割**: Docker Compose を通じた開発コマンドのショートカット。

コンテナ内で `npm run xxx` を実行するラッパーとして機能する。

| コマンド               | 内容                       |
| ---------------------- | -------------------------- |
| `make up/down/restart` | コンテナ起動・停止・再起動 |
| `make logs`            | ログストリーム             |
| `make shell`           | コンテナシェル             |
| `make lint`            | ESLint                     |
| `make format`          | Prettier write             |
| `make format-check`    | Prettier check             |
| `make orval`           | API クライアント生成       |
| `make ci`              | format-check + lint        |
