# ルーティング

## 画面一覧

| URL                                        | ページコンポーネント                                                | 概要                                         |
| ------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------- |
| `/`                                        | `src/app/page.tsx`                                                  | ホーム（現在はコンポーネント開発用デモ画面） |
| `/login`                                   | `src/app/(routes)/login/page.tsx`                                   | ログイン（EMAIL_OTP）                        |
| `/signup`                                  | `src/app/(routes)/signup/page.tsx`                                  | サインアップ                                 |
| `/signup/create-account`                   | `src/app/(routes)/signup/create-account/page.tsx`                   | Dreamer プロフィール作成                     |
| `/job/match`                               | `src/app/(routes)/job/match/page.tsx`                               | ジョブマッチング（スワイプ UI）              |
| `/job/match/question`                      | `src/app/(routes)/job/match/question/page.tsx`                      | オンボーディング質問フォーム                 |
| `/job/search`                              | `src/app/(routes)/job/search/page.tsx`                              | 求人検索                                     |
| `/job/detail/[job_id]`                     | `src/app/(routes)/job/detail/[job_id]/page.tsx`                     | 求人詳細                                     |
| `/chat`                                    | `src/app/(routes)/chat/page.tsx`                                    | チャット一覧                                 |
| `/chat/[conversation_id]`                  | `src/app/(routes)/chat/[conversation_id]/page.tsx`                  | チャット詳細                                 |
| `/mentor/dreamer`                          | `src/app/(routes)/mentor/dreamer/page.tsx`                          | Dreamer 一覧（管理者）                       |
| `/mentor/dreamer/new`                      | `src/app/(routes)/mentor/dreamer/new/page.tsx`                      | Dreamer 新規作成                             |
| `/mentor/dreamer/detail/[dreamer_id]`      | `src/app/(routes)/mentor/dreamer/detail/[dreamer_id]/page.tsx`      | Dreamer 詳細                                 |
| `/mentor/dreamer/detail/[dreamer_id]/edit` | `src/app/(routes)/mentor/dreamer/detail/[dreamer_id]/edit/page.tsx` | Dreamer 編集                                 |
| `/mentor/dreamer/group`                    | `src/app/(routes)/mentor/dreamer/group/page.tsx`                    | グループ一覧                                 |
| `/mentor/dreamer/group/new`                | `src/app/(routes)/mentor/dreamer/group/new/page.tsx`                | グループ新規作成                             |
| `/mentor/dreamer/group/edit`               | `src/app/(routes)/mentor/dreamer/group/edit/page.tsx`               | グループ編集                                 |
| `/mentor/dreamer/group/detail/[group_id]`  | `src/app/(routes)/mentor/dreamer/group/detail/[group_id]/page.tsx`  | グループ詳細                                 |

---

## URL 設計

- 全ルートは `src/app/(routes)/` のルートグループ配下（`(routes)` はURLに含まれない）
- 動的セグメント: `[conversation_id]`, `[job_id]`, `[dreamer_id]`, `[group_id]`
- メンター管理は `/mentor/` プレフィックスで分離

---

## ルーティング構成

Next.js 15 App Router を使用。

### ルートグループ `(routes)`

`src/app/(routes)/` ディレクトリはルートグループで、`(routes)` という文字列はURLに含まれない。全アプリのルートはこのグループに格納されており、共通 layout の適用範囲を制御するために使用できる。

### レイアウト

`src/app/layout.tsx` がルートレイアウト。全ページに適用:

- `lang="ja"`
- `min-h-screen pb-24`（NavBar 分の下部余白）
- `<NavBar />` をフッターとして固定配置

### テンプレート

`src/app/(routes)/chat/[conversation_id]/template.tsx` — チャット詳細専用テンプレート（ページ遷移ごとに再マウントされる）

---

## ナビゲーション

ボトムナビゲーション (`NavBar`) から遷移できる画面:

```
マッチ  → /job/match
探検    → /job/search
ホーム  → /
マップ  → (未実装・disabled)
設定    → (未実装・disabled)
```

アクティブ判定は `usePathname()` を用いてパスのプレフィックス一致で行う。

### プログラムナビゲーション

フック内での遷移例:

```ts
// オンボーディング完了後
router.push("/job/match");

// サインアップ確認後
router.push("/login/");

// チャット作成後
router.push(`/chat/${conversation.conversation_id}`);
```

---

## 認可制御

現時点では**フロントエンド側に明示的な認可制御（ルートガード）は実装されていない**。

- 認証チェック: なし（ミドルウェアなし）
- API リクエスト時に JWT がなければ 401 を受け取る
- 未ログイン時のリダイレクト処理: 未実装（TODO）

`/mentor/` 配下はメンター専用だが、フロントエンドではアクセス制限をしていない。バックエンド側の認可に依存する。

---

## 特記事項

- `/` は現在コンポーネントデモ画面として機能しており、本番画面ではない（TODO: ホーム画面を実装）
- `/job/match/question` は初回マッチングの前に誘導するオンボーディング画面
- `error.tsx` と `loading.tsx` は `/job/match` のみ存在（その他のルートでは未設定）
