# コンポーネント一覧

コンポーネントは **Atomic Design** に準拠した2層で構成される:

```
src/components/
├── ui/               ← 汎用・再利用可能 (ビジネスロジックなし)
│   ├── atoms/        ← 最小単位
│   ├── molecules/    ← atoms を組み合わせた中間部品
│   └── templates/    ← ページ横断のレイアウト部品
└── features/         ← 機能別 (ビジネスロジックを含む・再利用しない)
    ├── chat/
    ├── dreamer/
    ├── job/
    ├── mentor/
    └── user/
```

---

## UI Atoms

### `BaseButton` (`src/components/ui/atoms/Button.tsx`)

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `color` | `ColorVariantKey` | `'white'` | カラーバリアント |
| `children` | `ReactNode` | — | ボタン内容 |
| `className` | `string` | `''` | 追加クラス |
| `isLoading` | `boolean` | `false` | true の場合、スピナー表示・disabled |
| `onClick` | `() => void` | — | クリックハンドラ |

**利用箇所**: フォーム送信、オンボーディング質問送信

---

### `IconButton` (`src/components/ui/atoms/Button.tsx`)

`BaseButton` を拡張。Font Awesome `IconDefinition` または任意の `ReactNode` をアイコンとして受け付ける。

| 追加 Prop | 型 | 説明 |
|---|---|---|
| `icon` | `IconDefinition \| ReactNode` | ボタン左側に表示するアイコン |

---

### `FavoriteButton` (`src/components/ui/atoms/Button.tsx`)

ハート型のお気に入りトグルボタン。クリックで内部 state を反転し、パーティクルアニメーションを再生する。

| Prop | 型 | 説明 |
|---|---|---|
| `className` | `string` | 追加クラス |
| `onToggle` | `(isFavorite: boolean) => void` | 状態変更コールバック |

---

### `NavIcon` (`src/components/ui/atoms/Button.tsx`)

ボトムナビゲーション用アイコン。active 時はエメラルド、非 active 時はジンクカラー。

| Prop | 型 | 説明 |
|---|---|---|
| `icon` | `IconDefinition` | Font Awesome アイコン |
| `label` | `string` | テキストラベル |
| `active` | `boolean` | アクティブ状態 |

**利用箇所**: `NavBar` 内のみ

---

### `BaseInputText` / `BaseTextArea` (`src/components/ui/atoms/Input.tsx`)

ラベル付きテキスト入力。

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `value` | `string` | — | 入力値 |
| `placeholder` | `string` | — | プレースホルダー |
| `label` | `string` | `''` | ラベル（空文字で非表示） |
| `type` | `string` | `'text'` | input type |
| `className` | `string` | `''` | 追加クラス |
| `onChange` | `ChangeEventHandler` | — | 変更ハンドラ |

---

### `Tag` (`src/components/ui/atoms/Text.tsx`)

カラーバリアント付きタグ chip。`href` 指定で Link、`onClick` 指定でクリッカブル div になる。

| Prop | 型 | 説明 |
|---|---|---|
| `text` | `string` | 表示テキスト |
| `color` | `TagColor` | `slate/red/orange/yellow/green/blue/purple` |
| `href` | `string?` | リンク先 |
| `onClick` | `() => void?` | クリックハンドラ |

---

### `BreadCrumb` (`src/components/ui/atoms/Text.tsx`)

パンくずリスト。

| Prop | 型 | 説明 |
|---|---|---|
| `links` | `{ name: string; link: string }[]` | リンクの配列 |

---

## UI Molecules

### `CenterContainer` (`src/components/ui/molecules/Container.tsx`)

`flex justify-center items-center` のラッパー。

### `VerticalStackContainer`

縦方向 flex コンテナ。`space` prop (0/1/2/4/8/12/16) で `space-y-*` を制御。

### `HorizontalStackContainer`

横方向 flex コンテナ。`space` prop で `space-x-*` を制御。`onClick` を受け付ける。

### `GridContainer`

`grid auto-fit minmax` レイアウト。`minWidth` prop でカラム幅を制御。

**利用箇所**: `NavBar` (5 アイコンの均等配置)

---

### `SimpleAnimatePing` / `GeneratingPing` / `FadeInAnimation` (`src/components/ui/molecules/Animation.tsx`)

| コンポーネント | 説明 |
|---|---|
| `SimpleAnimatePing` | 3点ローディングアニメーション |
| `GeneratingPing` | 1点エメラルドアニメーション（AI 生成中表示） |
| `FadeInAnimation` | `children` をフェードイン表示。`duration` prop (秒) |

---

### `Card` (`src/components/ui/molecules/Card.tsx`)

TODO: コンポーネント実装を確認

### `Modal` (`src/components/ui/molecules/Modal.tsx`)

TODO: コンポーネント実装を確認

### `AddDreamerModal` (`src/components/ui/molecules/AddDreamerModal.tsx`)

メンター管理画面向けの Dreamer 追加モーダル。

### `CircularProgress` (`src/components/ui/molecules/CircularProgress.tsx`)

SVG ベースの円形プログレスバー。

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `value` | `number` | — | 現在値 |
| `max` | `number` | — | 最大値 |
| `label` | `string` | — | 中央ラベル |
| `unit` | `string` | — | 単位 |
| `color` | `string` | — | SVG stroke 色 |
| `size` | `number` | 100 | SVG サイズ (px) |
| `strokeWidth` | `number` | 10 | ストローク太さ |
| `animation` | `boolean` | `true` | アニメーション有効 |

**利用箇所**: ホーム画面のデモ表示、求人詳細の統計

---

## UI Templates

### `NavBar` (`src/components/ui/templates/NavBar.tsx`)

ボトムナビゲーションバー。`usePathname()` で現在のパスを取得し、アクティブ項目を自動判定する。

ナビ項目（ソースコードより）:

| ラベル | href | アクティブ条件 |
|---|---|---|
| マッチ | `/job/match` | `/job/match` で始まる |
| 探検 | `/job/search` | `/job/search` で始まる |
| ホーム | `/` | 完全一致 |
| マップ | (未実装) | `/map` で始まる |
| 設定 | (未実装) | `/setting` で始まる |

マップ・設定は `href` が `undefined` のため `aria-disabled` + `pointer-events-none` で表示のみ。

**レイアウト**: `fixed bottom-2`、横幅 `max-w-180`、`rounded-full` のフローティング UI

### `SideBar` (`src/components/ui/templates/SideBar.tsx`)

TODO: 実装を確認

---

## Features コンポーネント

### チャット (`src/components/features/chat/`)

| ファイル | 責務 |
|---|---|
| `ChatHeader.tsx` | チャットヘッダー（タイトル表示） |
| `ChatInputArea.tsx` | メッセージ入力エリア |
| `ChatListHeader.tsx` | チャット一覧ヘッダー |
| `ChatListItem.tsx` | チャット一覧の1行 |
| `MessageBubble.tsx` | メッセージバブル（ユーザー/AI 判別） |
| `Text.tsx` | チャット内テキストレンダリング (KaTeX/Markdown 対応) |
| `pages/ChatListPageContent.tsx` | チャット一覧ページのコンテンツ |
| `pages/ChatDetailPageContent.tsx` | チャット詳細ページのコンテンツ |
| `pages/ChatConversationTemplateContent.tsx` | テンプレートレイアウト |

**再利用方針**: features 内でのみ使用。他 features から参照しない。

---

### オンボーディング (`src/components/features/dreamer/`)

| ファイル | 責務 |
|---|---|
| `InitQuestionsPageContent.tsx` | 職業診断質問フォーム。全問回答後に `/api/v1/onboarding/answers` へ POST し `/job/match` へリダイレクト |

**利用フック**: `useInitQuestions`（質問取得）
**遷移先**: `/job/match`

---

### 求人 (`src/components/features/job/`)

**match/**

| ファイル | 責務 |
|---|---|
| `JobMatchingPageContent.tsx` | スワイプカード UI のメインコンテナ |
| `SwipeCard.tsx` | Framer Motion によるドラッグ可能カード |
| `SwipeResultMessage.tsx` | スワイプ後のフィードバック表示 |
| `JobDetailSection.tsx` | カード内の求人詳細セクション |
| `JobImageSection.tsx` | 求人画像表示 |
| `MatchLoadingContent.tsx` | ローディング状態 |
| `MatchErrorContent.tsx` | エラー状態 |

**search/**

| ファイル | 責務 |
|---|---|
| `JobSearchPageContent.tsx` | 検索 UI コンテナ |
| `SearchResults.tsx` | 検索結果リスト |
| `JobHistoryList.tsx` | 閲覧履歴リスト |

**detail/**

| ファイル | 責務 |
|---|---|
| `JobDetailPageContent.tsx` | 求人詳細ページ全体 |
| `JobHeader.tsx` | 求人名・会社名ヘッダー |
| `BasicInfoCards.tsx` | 基本情報カード群（給与・勤務形態など） |
| `SkillsAndRequirements.tsx` | スキル・要件セクション |
| `WorkEnvironment.tsx` | 職場環境セクション |
| `DetailDescriptions.tsx` | 詳細説明テキスト |
| `CompanyList.tsx` | 会社情報リスト |
| `InfoSection.tsx` | 汎用情報セクション |
| `ActionButtons.tsx` | 「チャット開始」などのアクションボタン |

---

### メンター管理 (`src/components/features/mentor/`)

管理者（メンター）向け UI。Dreamer・グループの CRUD。

| ファイル | 責務 |
|---|---|
| `pages/DreamerAdminPageContent.tsx` | Dreamer 一覧 |
| `pages/DreamerDetailPageContent.tsx` | Dreamer 詳細 |
| `pages/DreamerEditPageContent.tsx` | Dreamer 編集 |
| `pages/NewDreamerPageContent.tsx` | Dreamer 新規作成 |
| `pages/DreamerGroupAdminPageContent.tsx` | グループ一覧 |
| `pages/DreamerGroupDetailPageContent.tsx` | グループ詳細 |
| `pages/DreamerGroupEditPageContent.tsx` | グループ編集 |
| `pages/DreamerNewGroupPageContent.tsx` | グループ新規作成 |
| `Card.tsx` / `Form.tsx` / `Table.tsx` / `Text.tsx` | メンター画面専用の UI 部品 |

---

### ユーザー (`src/components/features/user/`)

| ファイル | 責務 |
|---|---|
| `LoginForm.tsx` | EMAIL\_OTP ログインフォーム |
| `SignUpForm.tsx` | メール登録・確認コード入力フォーム |
| `CreateNewAccount.tsx` | Dreamer プロフィール作成フォーム（姓名入力） |
| `LogoutButton.tsx` | ログアウトボタン |
| `pages/LoginPageContent.tsx` | ログインページコンテンツ |
| `pages/SignUpPageContent.tsx` | サインアップページコンテンツ |
| `pages/CreateNewAccountPageContent.tsx` | アカウント作成ページコンテンツ |

---

## コンポーネント作成規則

- ファイル名は `PascalCase.tsx`
- `'use client'` は対話的コンポーネントに必ず付与
- `*PageContent.tsx` はページのロジックをすべて持つ Client Component
- `page.tsx` は `*PageContent` を return するだけの薄いラッパー
- features/ コンポーネントは他の features から import しない
- ui/ コンポーネントはビジネスロジックを持たない
