# 状態管理

## 基本方針

グローバル状態ライブラリ（Zustand・Redux・Recoil など）は**使用していない**。

状態は **機能単位のカスタムフック**に閉じた `useState` で管理する。コンポーネント間の状態共有は props のみ。

---

## ローカル状態

すべての状態は `src/hooks/features/` 配下のカスタムフックが管理する。

### フックの標準パターン

```ts
const [data, setData]       = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError]     = useState<string | null>(null);

useEffect(() => {
    const fetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await api.xxx();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };
    fetch();
}, [deps]);

return { data, loading, error };
```

コンポーネントはこの3値を受け取り、`loading` でスケルトン、`error` でエラー表示、`data` で本体をレンダリングする。

---

## カスタムフック一覧

### チャット

| フック | 状態 | 説明 |
|---|---|---|
| `useChat(conversationId)` | `messages`, `title`, `loading`, `isSending` | メッセージ一覧の取得・送信・削除 |
| `useChatList()` | `conversations`, `loading` | チャット一覧の取得 |

#### `useChat` の特殊パターン（Optimistic Update）

メッセージ送信時、API 完了を待たずに UI を先行更新する:

```ts
// 1. ユーザーメッセージと空の AI バブルを即時追加
setMessages(prev => [...prev, userMsg, { id: aiId, text: '', isMyMessage: false }]);

// 2. SSE チャンクごとに AI バブルのテキストを追記
onChunk: (chunk) => setMessages(prev => {
    const next = [...prev];
    const last = next[next.length - 1];
    next[next.length - 1] = { ...last, text: last.text + chunk };
    return next;
});

// 3. エラー時は先行追加したメッセージを削除
onError: () => setMessages(prev => prev.filter(m => m.id !== tempId && m.id !== aiId));
```

---

### 求人

| フック | 状態 | 説明 |
|---|---|---|
| `useJobMatch()` | `currentJob`, `isLoading`, `error`, `swipeDirection`, `expanded`, `imageFullscreen`, `x`, `rotate`, `opacity` | スワイプマッチングの全状態。Framer Motion `useMotionValue`/`useTransform` を含む |
| `useSearch()` | `results`, `isLoading`, `error`, `hasSearched` | テキスト検索 |
| `useDetail(jobId)` | `jobData`, `isLoading`, `error` | 求人詳細取得 |
| `useJobHistory()` | `histories`, `isLoading`, `error` | 閲覧履歴取得 |
| `useJobChat()` | `isCreating` | 求人に紐づくチャット作成・遷移 |

#### `useJobMatch` の複雑な状態

スワイプ UI は状態が多いため `useJobMatch` に集約されている:

```ts
const x        = useMotionValue(0);         // カードの X 座標
const rotate   = useTransform(x, [-200,200], [-20,20]);
const opacity  = useTransform(x, [-200,-150,0,150,200], [0,0.8,1,0.8,0]);
const [swipeDirection, setSwipeDirection] = useState<'center'|'left'|'right'>('center');
const [expanded, setExpanded]             = useState(false);  // 詳細展開
const [imageFullscreen, setImageFullscreen] = useState(false);
```

`handleDragEndMain` でスワイプ判定し、閾値（180px または速度 500）を超えると good/bad API を呼び、次の推薦を取得する。

---

### オンボーディング

| フック | 状態 | 説明 |
|---|---|---|
| `useInitQuestions(version?)` | `questions`, `loading`, `error` | 初期質問一覧取得 |

回答の `selectedAnswers` 状態は `InitQuestionsPageContent` コンポーネント内の `useState<Record<string, string>>` で管理する（フックではなくコンポーネント直接）。

---

### ユーザー認証

| フック | 状態 | 説明 |
|---|---|---|
| `useSignUp()` | `step`, `email`, `confirmationCode`, `isLoading`, `error` | サインアップフロー（REGISTER → CONFIRM） |
| `useLogin()` | `step`, `email`, `confirmationCode`, `isLoading`, `error` | ログインフロー（CREATE\_ACCOUNT → LOGIN → CONFIRM） |
| `useCreateAccount()` | `familyName`, `givenName`, `isLoading`, `error` | Dreamer プロフィール作成 |

認証フローは `step` という文字列 union で多段階を表現する:

```ts
// ログインフロー
type LoginStep = "LOGIN" | "CONFIRM" | "CREATE_ACCOUNT";

// サインアップフロー
type SignUpStep = "REGISTER" | "CONFIRM";
```

---

## グローバル状態

現時点でグローバル状態は存在しない。

認証状態（ログイン済みかどうか）は Amplify が内部管理し、`fetchAuthSession()` で取得する。フロントエンドの `useState` には保持していない。

---

## キャッシュ管理

TanStack Query・SWR などのキャッシュライブラリは**使用していない**。

- データは各フックのライフサイクルに依存（コンポーネントのアンマウントで破棄）
- 画面遷移のたびにフェッチが走る
- `refresh` / `refetch` コールバックを返すフックでは手動再取得が可能:
  - `useChat.refresh`
  - `useChatList.refresh`
  - `useJobHistory.refetch`
- キャッシュが必要な場合は TanStack Query の導入を検討すること（TODO）

---

## データ同期

コンポーネント間のデータ同期は現在 props のみ。

- チャット送信後: `useChat` 内部で楽観的更新（上記参照）
- スワイプ後: `useJobMatch.fetchRecommendations()` で次の求人を再フェッチ
- 削除後: `useChat.deleteMessage` はリストから即時除外し、失敗時にロールバック
