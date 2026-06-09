# 開発ガイド

## 環境構築

### 前提条件

- Node.js 20+
- npm
- Docker / Docker Compose（Docker 環境の場合）
- バックエンドサーバー（Orval・prebuild に必要）

### ローカルセットアップ

```bash
git clone https://github.com/Propositio-AI/karynos-web.git
cd karynos-web
npm install --legacy-peer-deps
cp .env.local.example .env.local
# .env.local を編集して値を設定
```

### 環境変数

| キー | 説明 | 必須 |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | バックエンド REST API のベース URL | ○ |
| `OPENAPI_URL` | OpenAPI spec URL（orval・prebuild で使用） | ○ |

---

## 開発サーバ

```bash
npm run dev        # Turbopack で起動 (http://localhost:3000)
```

### Docker

```bash
make up            # コンテナビルド・起動（バックグラウンド）
make logs          # ログ確認
make down          # 停止・削除
make shell         # コンテナのシェルに入る
make restart       # 再起動
```

`docker-compose.yml` の設定:
- コンテナ名: `karynos-web-dev`
- ポート: `3000:3000`
- ホットリロード: `CHOKIDAR_USEPOLLING=true` / `WATCHPACK_POLLING=true`
- ボリューム: カレントディレクトリをマウント（`node_modules` と `.next` は除外）

---

## ビルド

```bash
npm run build
```

ビルドは 2 フェーズ:

1. **`prebuild`**（自動実行）
   - `scripts/check-api-compat.mjs` — リモート OpenAPI spec を取得、`openapi.json` との破壊的変更を検出
   - `npm run orval` — OpenAPI spec から API クライアントを生成
2. **`next build`** — TypeScript コンパイル + Next.js 本番ビルド

> バックエンドが起動していない状態では `prebuild` が失敗します。

---

## API クライアント生成（Orval）

```bash
npm run orval           # 一回生成
npm run orval:watch     # ウォッチモード

# Docker 環境
make orval
make orval-watch
```

生成先: `src/lib/api/gen/`（手動編集禁止）

詳細は [api-integration.md](api-integration.md) を参照。

---

## Lint

```bash
npm run lint           # ESLint チェック
npm run lint:fix       # 自動修正

# Docker 環境
make lint
make lint-fix
```

**設定** (`.eslintrc.json`):
- `next/core-web-vitals` + `next/typescript` + `prettier`
- `@typescript-eslint/no-explicit-any`: off
- 無視: `.next/`, `node_modules/`, `storybook-static/`, `coverage/`, `src/app/gen/`

---

## フォーマット

```bash
npm run prettier       # Prettier フォーマット（書き込み）

# Docker 環境
make format
make format-check
```

**設定** (`.prettierrc.json`):

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "useTabs": true,
  "tabWidth": 4,
  "printWidth": 100
}
```

> **既知の問題**: `package.json` に `format` および `format:check` スクリプトが定義されていない。
> `Makefile` と CI (`code-quality.yml`) は `npm run format:check` を呼ぶが、`package.json` には存在しない。
>
> **修正方法**: `package.json` の `scripts` に以下を追加する:
> ```json
> "format": "prettier --write .",
> "format:check": "prettier --check ."
> ```

---

## 型チェック

```bash
npx tsc --noEmit
```

`tsconfig.json` の設定:
- `strict: true`
- `noImplicitReturns: true`
- `noUncheckedIndexedAccess: true`
- `paths`: `@/*` → `./src/*`

---

## テスト

Vitest と Playwright がインストール済みだが、**テストファイルは現時点で存在しない**。

```bash
# インストール済みだが未使用
npx vitest
npx playwright test
```

---

## Storybook

Storybook v9 がインストール済みだが、**ストーリーファイルは現時点で存在しない**。

```bash
npm run storybook       # 開発サーバ起動 (port 6006)
npm run build-storybook # ビルド
```

---

## CI/CD

### GitHub Actions: `code-quality.yml`

**トリガー**: PR 作成・更新時、`main` / `develop` への push 時

**実行環境**: `ubuntu-latest`、Node.js 20

**ステップ:**

1. `actions/checkout@v4` — リポジトリのチェックアウト
2. `actions/setup-node@v4` — Node.js 20 セットアップ（npm キャッシュ有効）
3. `npm ci --legacy-peer-deps` — 依存関係インストール
4. `npm run format:check` — Prettier フォーマットチェック
5. `npm run lint` — ESLint チェック

**注意**: ステップ 4 の `npm run format:check` は現時点で `package.json` に定義されていないため **CI が失敗します**（上記「フォーマット」セクションの修正方法を参照）。

### 品質ゲート

CI を通過するためには以下の条件を満たす必要がある:

| チェック | コマンド | 状態 |
|---|---|---|
| Prettier チェック | `npm run format:check` | ⚠️ スクリプト未定義（要修正） |
| ESLint | `npm run lint` | ✅ 定義済み |

TypeScript 型チェック・テスト・Storybook ビルドは CI に含まれていない。

### Push 前の確認事項

```bash
# 1. Prettier チェック（スクリプト追加後）
npm run format:check

# 2. ESLint
npm run lint

# 3. TypeScript 型チェック（CI に含まれないが推奨）
npx tsc --noEmit
```

### デプロイ

CI/CD パイプラインのデプロイステップは現時点で設定されていない（TODO）。
