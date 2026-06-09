# API インテグレーション

## APIクライアント全体像

```
src/lib/api/
├── client.ts          ← 全モジュールを統合した api オブジェクト (使用エントリポイント)
├── mutator.ts         ← axios インスタンス + Cognito JWT インターセプター
├── stream.ts          ← SSE ストリーミング (Fetch API)
├── websocket.ts       ← WebSocket ユーティリティクラス
├── types.ts           ← 共通レスポンス型 (ApiResponse, ApiErrorType)
└── gen/               ← Orval 自動生成 (手動編集禁止)
    ├── chat/chat.ts
    ├── dreamer/dreamer.ts
    ├── job/job.ts
    ├── onboarding/onboarding.ts
    ├── matching/matching.ts
    └── schema/        ← OpenAPI スキーマ型定義
```

### api オブジェクト (`src/lib/api/client.ts`)

フックからは常に `api` オブジェクトを通じて呼び出す。

```ts
import { api } from '@/lib/api/client';

// 例
const result = await api.getOnboardingQuestionsApiV1OnboardingQuestionsGet({ version: 1 });
const job    = await api.getJobDetailApiV1JobDetailJobIdGet(42);
```

`api` は各モジュールの関数を spread したフラットなオブジェクト:

```ts
export const api = {
  ...getChat(),       // /api/v1/chat/*
  ...getJob(),        // /api/v1/job/*
  ...getDreamer(),    // /api/v1/dreamer/*
  ...getOnboarding(), // /api/v1/onboarding/*
  ...getMatching(),   // /api/v1/matching/*
  streamChatMessageApiV1ChatMessageConversationIdPost,  // SSE
};
```

---

## Orval による自動生成

`src/lib/api/gen/` 配下は **手動編集禁止**。バックエンドの OpenAPI spec から自動生成される。

### 生成コマンド

```bash
npm run orval          # 一回生成
npm run orval:watch    # 変更監視・自動再生成
```

### 生成元

`orval.config.ts` の `input.target` に指定された URL (`OPENAPI_URL` 環境変数) からスペックを取得する。

### タグ分割 (`mode: "tags-split"`)

バックエンドの OpenAPI タグに対応したディレクトリへ分割出力される:

| バックエンドタグ | 出力ファイル |
|---|---|
| chat | `gen/chat/chat.ts` |
| dreamer | `gen/dreamer/dreamer.ts` |
| job | `gen/job/job.ts` |
| onboarding | `gen/onboarding/onboarding.ts` |
| matching | `gen/matching/matching.ts` |

> **注意**: `onboarding/` と `matching/` は現時点でバックエンドのエンドポイント移行に伴い手動作成したファイル。バックエンドが新しいタグで OpenAPI を公開した後に `npm run orval` を実行すれば自動生成に切り替わる。

### API 互換チェック (`scripts/check-api-compat.mjs`)

`npm run build` の `prebuild` フックで実行される。

- リモートの OpenAPI spec を取得し、ローカルの `openapi.json` と比較
- **破壊的変更** (パス削除・メソッド削除・新規必須パラメータ追加) を検出するとビルドを失敗させる
- 非破壊的変更はそのまま `openapi.json` を更新して続行

---

## 認証 (`src/lib/api/mutator.ts`)

全 REST リクエストに Cognito の JWT アクセストークンを付与する。

```ts
axiosInstance.interceptors.request.use(async (config) => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
```

- SSR 環境（`typeof window === "undefined"`）ではトークン取得をスキップ
- トークン取得失敗時はエラーを無視し、認証なしでリクエストを継続（未認証エンドポイント向け）

### ストリーミング時の認証 (`src/lib/api/stream.ts`)

Fetch API でも同様に `fetchAuthSession()` でトークンを取得し `Authorization` ヘッダーへ付与する。

---

## ストリーミング API (`src/lib/api/stream.ts`)

チャットメッセージの AI 応答は SSE (Server-Sent Events) で受信する。

```ts
await api.streamChatMessageApiV1ChatMessageConversationIdPost(
    conversationId,
    { role: 'user', text_content: text },
    {
        onChunk: (chunk: string) => { /* チャンク受信ごとに呼ばれる */ },
        onComplete: async () => { /* 完了時 */ },
        onError: async (err: Error) => { /* エラー時 */ },
    },
);
```

**内部動作:**
1. `Fetch` で POST リクエスト
2. `response.body.getReader()` でストリームを読み取り
3. 各チャンクを `TextDecoder` でデコードして `onChunk` を呼び出す
4. 完了後、全レスポンスが JSON なら parse して `onComplete` へ渡す

---

## WebSocket (`src/lib/api/websocket.ts`)

型付きの汎用 WebSocket クライアント。現時点では未使用だが実装済み。

```ts
new WebSocketCall<TSend, TStartReceive, TStreamReceive, TEndReceive>(
    url,
    onStart,    // index === 0 のメッセージ
    onStream,   // index > 0 の途中メッセージ
    onEnd,      // index === -1 の終了メッセージ
    onError,
);
```

メッセージの `index` フィールドでシーケンスを判定する設計。

---

## エンドポイント一覧

### Chat (`/api/v1/chat/`)

| 関数名 | メソッド | パス |
|---|---|---|
| `createNewConversationApiV1ChatPost` | POST | `/api/v1/chat/` |
| `getConversationHistoryApiV1ChatHistoryGet` | GET | `/api/v1/chat/history` |
| `getConversationDetailsApiV1ChatConversationConversationIdGet` | GET | `/api/v1/chat/conversation/{id}` |
| `deleteConversationApiV1ChatConversationConversationIdDelete` | DELETE | `/api/v1/chat/conversation/{id}` |
| `deleteMessagesInConversationApiV1ChatMessageMessageIdDelete` | DELETE | `/api/v1/chat/message/{id}` |
| `streamChatMessageApiV1ChatMessageConversationIdPost` | POST (SSE) | `/api/v1/chat/message/{id}` |

### Job (`/api/v1/job/`)

| 関数名 | メソッド | パス |
|---|---|---|
| `getJobDetailApiV1JobDetailJobIdGet` | GET | `/api/v1/job/detail/{job_id}` |
| `getViewingHistoryApiV1JobHistoryGet` | GET | `/api/v1/job/history` |
| `searchJobsApiV1JobSearchGet` | GET | `/api/v1/job/search` |
| `markGoodApiV1JobGoodHistoryIdPut` | PUT | `/api/v1/job/good/{history_id}` |
| `markBadApiV1JobBadHistoryIdPut` | PUT | `/api/v1/job/bad/{history_id}` |
| `markSaveApiV1JobSaveHistoryIdPut` | PUT | `/api/v1/job/save/{history_id}` |

### Onboarding (`/api/v1/onboarding/`)

| 関数名 | メソッド | パス |
|---|---|---|
| `getOnboardingQuestionsApiV1OnboardingQuestionsGet` | GET | `/api/v1/onboarding/questions` |
| `submitOnboardingAnswersApiV1OnboardingAnswersPost` | POST | `/api/v1/onboarding/answers` |
| `getOnboardingAnswersHistoryApiV1OnboardingAnswersHistoryGet` | GET | `/api/v1/onboarding/answers/history` |

### Matching (`/api/v1/matching/`)

| 関数名 | メソッド | パス |
|---|---|---|
| `recommendJobsApiV1MatchingRecommendGet` | GET | `/api/v1/matching/recommend` |
| `recommendJobsDebugApiV1MatchingRecommendDebugGet` | GET | `/api/v1/matching/recommend/debug` |

### Dreamer (`/api/v1/dreamer/`)

管理者向け CRUD。Dreamer・グループの作成・取得・更新・削除。詳細は `src/lib/api/gen/dreamer/dreamer.ts` を参照。

---

## エラーハンドリング

共通のエラー型は `src/lib/api/types.ts` で定義:

```ts
export enum ApiErrorType {
    UNAUTHORIZED, FORBIDDEN, NOT_FOUND, SERVER_ERROR, NETWORK_ERROR, UNKNOWN
}

export interface ApiResponse<T> {
    success: boolean;
    message: string[];
    data: T;
}
```

各フックはエラー時に `useState<string | null>` でエラーメッセージを保持し、コンポーネント側で表示する。グローバルなエラーハンドラーは現時点では存在しない。

---

## データ取得戦略

TanStack Query・SWR などのキャッシュライブラリは**使用していない**。

全データ取得はカスタムフック内の `useEffect` + `useState` で実装される:

```ts
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetch = async () => {
        setLoading(true);
        const result = await api.xxx();
        setData(result);
        setLoading(false);
    };
    fetch();
}, []);
```

- キャッシュなし（画面遷移のたびに再フェッチ）
- `refresh` / `refetch` 関数を返すフックが多く、手動再フェッチをサポート
