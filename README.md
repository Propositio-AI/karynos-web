# karynos-web

Karynos のフロントエンドアプリケーション。Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 で構築されたジョブマッチング・チャットサービスです。

---

## 主な機能

- **オンボーディング** — 初期質問への回答でユーザープロファイルを構築
- **ジョブマッチング** — スワイプ UI によるベクトル検索ベースの求人推薦
- **求人検索** — テキストによる求人全文検索
- **AI チャット** — 求人に紐づいたストリーミング AI 会話
- **メンター管理** — Dreamer・グループの CRUD（管理者側）

---

## 技術スタック

| カテゴリ | ライブラリ・バージョン |
|---|---|
| フレームワーク | Next.js 15 (App Router, Turbopack) |
| 言語 | TypeScript 5 (strict) |
| スタイリング | Tailwind CSS v4 |
| 認証 | AWS Amplify v6 / Cognito (EMAIL\_OTP) |
| API クライアント | Axios + Orval v7 (OpenAPI 自動生成) |
| アニメーション | Motion v12 (Framer Motion) |
| アイコン | Font Awesome, React Icons |
| UI プリミティブ | Radix UI |
| コンテナ | Docker / Docker Compose |

---

## セットアップ

```bash
git clone https://github.com/Propositio-AI/karynos-web.git
cd karynos-web
npm install --legacy-peer-deps
cp .env.local.example .env.local   # 値を埋める
```

`.env.local` の必須キー:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
OPENAPI_URL=http://localhost:8000/openapi.json
```

---

## 開発サーバ起動

```bash
make up              # コンテナ起動 (port 3000)
make logs            # ログ確認
make down            # 停止
```

---

## ビルド

```bash
npm run build        # prebuild (API 互換チェック → orval) → next build
```

`prebuild` は `scripts/check-api-compat.mjs` でバックエンド API との破壊的変更を検出します。バックエンドが起動していない場合はビルドが失敗します。

---

## ディレクトリ構成（簡易）

```
src/
├── app/               # Next.js App Router (pages・layouts)
├── components/
│   ├── features/      # 機能別コンポーネント (ページロジック)
│   └── ui/            # 汎用 UI コンポーネント (atoms/molecules/templates)
├── hooks/features/    # カスタムフック (データ取得・状態管理)
├── lib/
│   ├── api/           # API クライアント (Orval 生成コード + 手動実装)
│   └── auth/          # Amplify 設定・ログアウト
└── types/             # 型定義
```

---

## ドキュメント一覧

| ドキュメント | 内容 |
|---|---|
| [architecture.md](docs/architecture.md) | アーキテクチャ概要・データフロー・設計思想 |
| [api-integration.md](docs/api-integration.md) | APIクライアント・認証・ストリーミング |
| [components.md](docs/components.md) | コンポーネント一覧・Props・責務 |
| [design-system.md](docs/design-system.md) | カラー・タイポグラフィ・スタイルルール |
| [development.md](docs/development.md) | 環境構築・CI/CD・各種コマンド |
| [directory-structure.md](docs/directory-structure.md) | ディレクトリ役割・依存関係 |
| [routing.md](docs/routing.md) | 画面一覧・URL設計・ナビゲーション |
| [state-management.md](docs/state-management.md) | 状態管理パターン・フック設計 |

---

## Push 前チェックリスト

CI (`code-quality.yml`) で実際に実行される内容:

- [ ] `npm run format:check` — Prettier フォーマットチェック通過
- [ ] `npm run lint` — ESLint チェック通過

> **注意**: `package.json` に `format:check` スクリプトが未定義のため現在 CI が失敗します。`"format:check": "prettier --check ."` を追加してください。詳細は [development.md](docs/development.md) を参照。
