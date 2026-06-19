# Dream Action

## 概要

Dream Action は、Karynos の中核機能の一つ。教員がアップロードした授業資料と、生徒（Dreamer）が Dream Matching で発見した「仮の夢（職業）」を AI が接続し、生徒一人ひとりに最適化された補助教材を生成・配布する機能。

「今学んでいる数学や歴史がその職業でどう役立つか」を AI が提示することで、生徒が学習の意味を実感できるようにする。

> この教材は「補助教材」であり、教員の授業スタイルを置き換えるものではない。

---

## Mentor（教員）側のフロー

```
1. 授業資料をアップロード
   └── /mentor/classes/[class_id]/materials
       フォルダ作成 → ファイルアップロード（PDF/PPTX/DOCX等）

2. Dream Action で教材生成
   └── /mentor/dream-action/[class_id]
       授業資料フォルダを選択 → 「生成開始」ボタン
       → 全生徒分を並行生成（生成中ステータス表示）
       → 生成完了（3秒後、本番は数十秒〜数分）

3. 内容確認
   └── 生成された教材のプレビュー展開
       各生徒の「仮の夢」との接続内容を確認

4. 生徒へ配布
   └── 「配布」ボタン → 生徒の補助教材一覧に表示される
```

## Dreamer（生徒）側のフロー

```
1. 補助教材受信通知
   └── NavBar「教材」バッジ / 未読カウント

2. 補助教材一覧を確認
   └── /dream-action
       教科・単元・仮の夢との接続タイトルを一覧表示

3. 教材詳細を読む
   └── /dream-action/[material_id]
       「今学んでいる○○が、△△（仮の夢）でどう役立つか」
       AI 生成の解説を読む → 既読マーク

4. Dream Matching へ連携
   └── 「仮の夢をもっと探してみる」リンク → /job/match
```

---

## ステータスライフサイクル

```
pending → generating → completed → distributed → read
            ↓ (失敗)
          failed → generating（再試行）
```

| ステータス | 説明 |
|---|---|
| `pending` | 生成待ち（教材未生成） |
| `generating` | AI が生成中 |
| `completed` | 生成完了・教員確認待ち |
| `failed` | 生成失敗（再試行可能） |
| `distributed` | 生徒へ配布済み |
| `read` | 生徒が閲覧済み（Dreamer側のみ） |

---

## 型定義

`src/types/feature/dream-action/dreamAction.ts`

```ts
// 教員側（生成・配布管理）
type DreamActionMaterial = {
  id: string
  classId, className, dreamerId, dreamerName, dreamerJob
  subject, unit
  status: DreamActionStatus
  materialFileId, generatedContent, relevanceExplanation
  distributedAt, createdAt, updatedAt
}

// 生徒側（受信・閲覧）
type DreamerDreamActionMaterial = {
  id: string
  subject, unit
  dreamerJob: string       // この生徒の仮の夢
  relevanceTitle: string   // "○○がどう役立つか"
  relevanceContent: string // AI 生成の解説
  status: 'distributed' | 'read'
  distributedAt, isRead, sourceUnit
}
```

---

## API エンドポイント（要確認）

バックエンドとの突き合わせが必要。現時点ではモック実装。詳細は [api-endpoints.md](api-endpoints.md) を参照。

---

## 現在の実装状況

- **フロントエンド**: 実装済み（モックデータで動作確認可能）
- **バックエンド API**: 未実装（モックで代替中）
- **AI 生成**: 未接続（3秒後に固定文字列を返すシミュレーション）

バックエンド完成後は `src/lib/api/gen/mentor/` と `src/lib/api/gen/dreamAction/` の関数を実際の API 呼び出しに差し替える。
