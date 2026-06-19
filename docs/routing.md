# ルーティング

## 画面一覧

### Dreamer（生徒）側

| URL | ページコンポーネント | 概要 |
|---|---|---|
| `/` | `src/app/page.tsx` | ホーム |
| `/login` | `src/app/(routes)/login/page.tsx` | ログイン（EMAIL_OTP） |
| `/signup` | `src/app/(routes)/signup/page.tsx` | サインアップ |
| `/signup/create-account` | `src/app/(routes)/signup/create-account/page.tsx` | Dreamer プロフィール作成 |
| `/job/match` | `src/app/(routes)/job/match/page.tsx` | Dream Matching（スワイプ UI） |
| `/job/match/question` | `src/app/(routes)/job/match/question/page.tsx` | オンボーディング質問 |
| `/job/search` | `src/app/(routes)/job/search/page.tsx` | 職種検索 |
| `/job/detail/[job_id]` | `src/app/(routes)/job/detail/[job_id]/page.tsx` | 職種詳細 |
| `/chat` | `src/app/(routes)/chat/page.tsx` | チャット一覧 |
| `/chat/[conversation_id]` | `src/app/(routes)/chat/[conversation_id]/page.tsx` | チャット詳細 |
| `/dream-action` | `src/app/(routes)/dream-action/page.tsx` | **補助教材一覧（Dream Action）** |
| `/dream-action/[material_id]` | `src/app/(routes)/dream-action/[material_id]/page.tsx` | **補助教材詳細** |

### Mentor（教員）側

| URL | ページコンポーネント | 概要 |
|---|---|---|
| `/mentor/dreamer` | `src/app/(routes)/mentor/dreamer/page.tsx` | Dreamer 一覧（管理者） |
| `/mentor/dreamer/new` | `src/app/(routes)/mentor/dreamer/new/page.tsx` | Dreamer 新規作成 |
| `/mentor/dreamer/detail/[dreamer_id]` | `src/app/(routes)/mentor/dreamer/detail/[dreamer_id]/page.tsx` | Dreamer 詳細 |
| `/mentor/dreamer/detail/[dreamer_id]/edit` | `src/app/(routes)/mentor/dreamer/detail/[dreamer_id]/edit/page.tsx` | Dreamer 編集 |
| `/mentor/dreamer/group` | `src/app/(routes)/mentor/dreamer/group/page.tsx` | グループ一覧 |
| `/mentor/dreamer/group/new` | `src/app/(routes)/mentor/dreamer/group/new/page.tsx` | グループ新規作成 |
| `/mentor/dreamer/group/edit` | `src/app/(routes)/mentor/dreamer/group/edit/page.tsx` | グループ編集 |
| `/mentor/dreamer/group/detail/[group_id]` | `src/app/(routes)/mentor/dreamer/group/detail/[group_id]/page.tsx` | グループ詳細 |
| `/mentor/classes` | `src/app/(routes)/mentor/classes/page.tsx` | **クラス管理** |
| `/mentor/classes/[class_id]` | `src/app/(routes)/mentor/classes/[class_id]/page.tsx` | **クラス詳細** |
| `/mentor/classes/[class_id]/students` | `src/app/(routes)/mentor/classes/[class_id]/students/page.tsx` | **履修生徒一覧** |
| `/mentor/classes/[class_id]/students/[student_id]` | `src/app/(routes)/mentor/classes/[class_id]/students/[student_id]/page.tsx` | **生徒詳細（関心傾向含む）** |
| `/mentor/classes/[class_id]/materials` | `src/app/(routes)/mentor/classes/[class_id]/materials/page.tsx` | **授業資料フォルダ** |
| `/mentor/overview` | `src/app/(routes)/mentor/overview/page.tsx` | **クラス全体管理（分析ダッシュボード）** |
| `/mentor/materials` | `src/app/(routes)/mentor/materials/page.tsx` | **授業資料（全クラス横断）** |
| `/mentor/dream-action` | `src/app/(routes)/mentor/dream-action/page.tsx` | **Dream Action 一覧（クラス別状況）** |
| `/mentor/dream-action/[class_id]` | `src/app/(routes)/mentor/dream-action/[class_id]/page.tsx` | **Dream Action クラス別管理** |

---

## URL 設計

- 全ルートは `src/app/(routes)/` のルートグループ配下（`(routes)` はURLに含まれない）
- 動的セグメント: `[conversation_id]`, `[job_id]`, `[dreamer_id]`, `[group_id]`, `[class_id]`, `[student_id]`, `[material_id]`
- Mentor 管理は `/mentor/` プレフィックスで分離
- Dream Action（Dreamer受信側）は `/dream-action/` プレフィックス

---

## ルーティング構成

Next.js 15 App Router を使用。

### ルートグループ `(routes)`

`src/app/(routes)/` ディレクトリはルートグループで、`(routes)` という文字列はURLに含まれない。

### レイアウト

`src/app/layout.tsx` がルートレイアウト。全ページに適用:
- `lang="ja"`
- `min-h-screen pb-24`（NavBar 分の下部余白）
- `<NavBar />` をフッターとして固定配置

Mentor 側ページは `SideBar` コンポーネントを各 PageContent 内で使用するため、ルートレイアウトとは別に左サイドバーレイアウトを実現している。

---

## ナビゲーション

### Dreamer 用ボトムナビゲーション（NavBar）

```
マッチ  → /job/match
探検    → /job/search
ホーム  → /
教材    → /dream-action  ← Dream Action受信
設定    → (未実装・disabled)
```

### Mentor 用サイドバー（SideBar）

```
メインメニュー:
  ダッシュボード → /mentor/dreamer
  Dreamer管理   → /mentor/dreamer
  グループ管理   → /mentor/dreamer/group
  クラス管理     → /mentor/classes
  クラス全体管理 → /mentor/overview

授業管理:
  授業資料       → /mentor/materials
  Dream Action  → /mentor/dream-action

管理機能:
  設定 → (未実装)

サポート:
  ヘルプ → (未実装)
  マニュアル → (未実装)
```

---

## 認可制御

`src/middleware.ts` でルートガードを実装。

- `/job/*`, `/chat/*`, `/dream-action/*`, `/mentor/*` → 認証必須。未認証時は `/login?redirect=<元パス>` にリダイレクト
- `/mentor/*` → Mentor ロール必須（`user_role` Cookie が `mentor` でない場合は `/` にリダイレクト）
- `/login`, `/signup/*` → パブリック（認証不要）

Amplify v6 の Cookie パターン（`CognitoIdentityServiceProvider.{clientId}.*.accessToken`）または `access_token` Cookie の存在で認証状態を判定。Mentor ロールは `user_role` Cookie で判定（ログイン時にサーバーアクションで設定することを想定）。

---

## 特記事項

- Dream Action（Dreamer受信）は NavBar の「教材」から到達（`/dream-action`）
- Dream Action（Mentor生成・配布）は SideBar の「Dream Action」から到達（`/mentor/dream-action`）
- クラス管理（`/mentor/classes`）と旧グループ管理（`/mentor/dreamer/group`）は別概念として共存
- `error.tsx` と `loading.tsx` は `/job/match` のみ存在（その他は PageContent 内で状態管理）
