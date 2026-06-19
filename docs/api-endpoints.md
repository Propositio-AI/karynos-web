# API エンドポイント一覧

バックエンド（FastAPI）との突き合わせ用リファレンス。「要確認」は未確定のエンドポイント。

---

## 認証（Cognito）

Amplify SDK 経由。REST エンドポイントではない。

| 操作 | 実装 |
|---|---|
| サインアップ | `signUp()` – EMAIL_OTP |
| OTP 確認 | `confirmSignUp()` |
| ログイン | `signIn()` – `authFlowType: "USER_AUTH"` |
| ログイン確認（OTP） | `confirmSignIn()` |
| ログアウト | `signOut()` + Server Action で Cookie 削除 |
| JWT 取得 | `fetchAuthSession()` → `session.tokens.accessToken` |

JWT クレーム:
- `cognito:groups`: `["mentor"]` または `["dreamer"]`
- `custom:role`: フォールバック

---

## 既存エンドポイント（実装済み・Orval 生成）

### チャット

| Method | Path | 概要 |
|---|---|---|
| POST | `/api/v1/chat/conversation` | 会話作成 |
| GET | `/api/v1/chat/conversation/{id}/messages` | メッセージ一覧 |
| POST | `/api/v1/chat/message/{conversation_id}` | メッセージ送信（SSE） |

### ジョブ・マッチング

| Method | Path | 概要 |
|---|---|---|
| GET | `/api/v1/job/search` | 職種検索 |
| GET | `/api/v1/job/{job_id}` | 職種詳細 |
| GET | `/api/v1/job/history` | 閲覧履歴 |
| POST | `/api/v1/matching/suggest` | マッチング提案 |

### Dreamer（オンボーディング）

| Method | Path | 概要 |
|---|---|---|
| GET | `/api/v1/dreamer/init-questions` | 初期質問取得 |
| POST | `/api/v1/dreamer/init-answers` | 初期回答送信 |
| POST | `/api/v1/dreamer` | Dreamer 新規作成 |
| PUT | `/api/v1/dreamer/{id}` | Dreamer 更新 |
| GET | `/api/v1/dreamer/groups` | グループ一覧 |
| POST | `/api/v1/dreamer/group` | グループ作成 |

---

## Mentor クラス管理（要確認・現在モック）

| Method | Path | 概要 | フロント実装 |
|---|---|---|---|
| GET | `/api/v1/mentor/classes` | 担当クラス一覧 | `getClasses()` |
| GET | `/api/v1/mentor/classes/{class_id}` | クラス詳細 | `getClassById()` |
| GET | `/api/v1/mentor/classes/{class_id}/students` | 履修生徒一覧 | `getStudentsInClass()` |
| GET | `/api/v1/mentor/students/{student_id}` | 生徒詳細 | `getStudentById()` |
| GET | `/api/v1/mentor/classes/{class_id}/stats` | クラス統計 | `getClassStats()` |

---

## Mentor 授業資料（要確認・現在モック）

| Method | Path | 概要 | フロント実装 |
|---|---|---|---|
| GET | `/api/v1/mentor/classes/{class_id}/material-folders` | フォルダ一覧 | `getMaterialFolders()` |
| POST | `/api/v1/mentor/material-folders` | フォルダ作成 | `createMaterialFolder()` |
| DELETE | `/api/v1/mentor/material-folders/{folder_id}` | フォルダ削除 | `deleteMaterialFolder()` |
| GET | `/api/v1/mentor/material-folders/{folder_id}/files` | ファイル一覧 | `getMaterialFiles()` |
| POST | `/api/v1/mentor/material-folders/{folder_id}/files` | ファイルアップロード（multipart/form-data） | `uploadMaterialFile()` |
| DELETE | `/api/v1/mentor/material-files/{file_id}` | ファイル削除 | `deleteMaterialFile()` |

---

## Dream Action Mentor 側（要確認・現在モック）

| Method | Path | 概要 | フロント実装 |
|---|---|---|---|
| GET | `/api/v1/mentor/classes/{class_id}/dream-actions` | Dream Action 一覧 | `getDreamActions()` |
| POST | `/api/v1/mentor/dream-actions/generate` | 補助教材生成開始 | `generateDreamAction()` |
| GET | `/api/v1/mentor/dream-actions/batch/{batch_id}` | 生成ステータス確認 | （要実装） |
| POST | `/api/v1/mentor/dream-actions/{id}/distribute` | 生徒へ配布 | `distributeDreamAction()` |
| POST | `/api/v1/mentor/dream-actions/{id}/retry` | 再試行 | `retryDreamAction()` |

リクエスト例（`/generate`）:
```json
{
  "class_id": "class-1",
  "material_folder_id": "folder-1"
}
```

---

## Dream Action Dreamer 側（要確認・現在モック）

| Method | Path | 概要 | フロント実装 |
|---|---|---|---|
| GET | `/api/v1/dream-actions` | 自分宛の補助教材一覧 | `getDreamerDreamActionMaterials()` |
| GET | `/api/v1/dream-actions/{id}` | 補助教材詳細 | （一覧から取得） |
| PATCH | `/api/v1/dream-actions/{id}/read` | 既読マーク | `markDreamActionAsRead()` |

---

## 統一エラーフォーマット（バックエンドとの合意が必要）

```json
{
  "detail": "エラーメッセージ",
  "code": "ERROR_CODE",
  "status": 400
}
```

フロントエンドはすべての API エラーをこのフォーマットとして受け取ることを前提にハンドリングする。
