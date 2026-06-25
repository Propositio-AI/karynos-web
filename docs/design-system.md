# デザインシステム

## スタイリング方針

Tailwind CSS v4 ユーティリティファーストでスタイルを適用する。カスタムクラスは `src/app/globals.css` でのみ定義する。CSS Modules や styled-components は使用しない。

---

## カラーシステム

### ボタンカラーバリアント (`src/types/ui/color.ts`)

```ts
export type ColorVariantKey = "slate" | "white" | "emerald" | "blue";
```

| バリアント | 背景             | テキスト        | ホバー           | 用途                     |
| ---------- | ---------------- | --------------- | ---------------- | ------------------------ |
| `slate`    | `bg-slate-900`   | white           | `bg-slate-800`   | プライマリアクション     |
| `white`    | `bg-white`       | `text-zinc-500` | `bg-zinc-200`    | セカンダリ・アウトライン |
| `emerald`  | `bg-emerald-500` | white           | `bg-emerald-600` | ナビアクティブ・成功     |
| `blue`     | `bg-blue-500`    | white           | `bg-blue-400`    | アクセント               |

`globals.css` でカスタムクラスとして定義:

```css
.bg-slate {
	@apply bg-slate-900 text-white hover:bg-slate-800;
}
.bg-emerald {
	@apply bg-emerald-500 text-white hover:bg-emerald-600;
}
.bg-blue {
	@apply bg-blue-500 text-white hover:bg-blue-400;
}
```

### タグカラー (`src/components/ui/atoms/Text.tsx`)

```ts
type TagColor = "slate" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";
```

各色は `bg-{color}-100` / `hover:bg-{color}-200` / `text-{color}-800` の組み合わせ。

### ローディングスピナーカラー

ボタンの `isLoading` 時、スピナーは `LoadingColorVariants` で制御:

| ボタンカラー | スピナー色     |
| ------------ | -------------- |
| slate        | `border-white` |
| white        | `border-black` |
| emerald      | `border-white` |
| blue         | `border-white` |

---

## タイポグラフィ

`globals.css` の `@layer base` でデフォルトスタイルを定義:

| 要素    | スタイル                |
| ------- | ----------------------- |
| `h1`    | `text-3xl font-black`   |
| `h2`    | `text-3xl font-bold`    |
| `h3`    | `text-xl font-semibold` |
| `h4`    | `font-semibold`         |
| `small` | `text-sm`               |
| `body`  | `text-slate-900`        |

KaTeX を使用する画面では数式レンダリングのため `katex/dist/katex.min.css` を `layout.tsx` でインポートしている。

---

## コンポーネント階層（Atomic Design）

```
atoms      → molecules    → templates
Button        Container      NavBar
Input         Card           SideBar
Text          Modal
              Animation
              CircularProgress
```

**依存方向**: 下位 → 上位のみ。`molecules` は `atoms` を参照してよい。`templates` は `atoms` + `molecules` を参照してよい。逆方向は禁止。

---

## レイアウト

### ボトムナビゲーション

`NavBar` は `fixed bottom-2` で全ページに固定表示される。ルートレイアウト (`layout.tsx`) で `pb-24` を body に付与してコンテンツが NavBar に隠れないようにしている。

- 幅: `max-w-180`（最大 720px）
- 形状: `rounded-full`（pill 型）
- 背景: `bg-white border border-zinc-200`

### ページコンテナ

ページレベルのコンテナは機能ごとに個別定義。共通のページコンテナコンポーネントは現時点では存在しない。

---

## アニメーション

Motion v12（Framer Motion）を使用:

| 用途                       | 実装                                                |
| -------------------------- | --------------------------------------------------- |
| ボタンローディングスピナー | `motion.div` + `animate: { rotate: 360 }`           |
| お気に入りボタン           | `motion.button` + scale/rotate + パーティクル       |
| フェードイン表示           | `FadeInAnimation` コンポーネント (`opacity: 0 → 1`) |
| スワイプカード             | `useMotionValue` + `useTransform` + `drag="x"`      |

Tailwind CSS アニメーションも一部使用:

- `animate-ping` — ローディングドット (`SimpleAnimatePing`, `GeneratingPing`)

---

## アイコン

2 ライブラリを使用（混在しているが統一を検討）:

| ライブラリ                                      | 用途                                         |
| ----------------------------------------------- | -------------------------------------------- |
| Font Awesome (`@fortawesome/react-fontawesome`) | NavBar・サイドバー・ボタンアイコン           |
| React Icons (`react-icons`)                     | `FiHeart`（お気に入りボタン）                |
| Lucide React (`lucide-react`)                   | インストール済みだが実装箇所を確認中（TODO） |

---

## UIルール

- **ボーダー**: `border border-zinc-200` が標準。アクティブ要素は `border-blue-500` または `border-emerald-500`
- **角丸**: カード `rounded-lg`、ボタン `rounded-lg`、NavBar `rounded-full`
- **フォーム入力**: `border border-zinc-200 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`
- **ローディング中テキスト**: `text-gray-500`
- **エラーテキスト**: `text-red-600`
- **スペーシング**: `Container` コンポーネントの `space` prop を優先（直接 `mt-*/mb-*` の多用を避ける）
