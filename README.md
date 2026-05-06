# No Code Form App（PHP + SQLite）

シンプルなフォーム作成・回答収集アプリです。  
PHP + SQLite で構成された軽量なバックエンドAPIです。

---

## 📌 機能

### フォーム管理
- フォーム作成（タイトル・説明・項目）
- フォーム編集
- フォーム削除
- フォーム一覧取得
- フォーム詳細取得

### データ構造
フォームは `fields` にJSON形式で項目を保存します。

---

## 🧱 技術構成

- PHP（APIサーバー）
- SQLite（データベース）
- JSON API
- CORS対応（フロント接続用）

---

## 📁 ディレクトリ構成

backend/
 ├── db.php          # DB接続・テーブル作成
 ├── save.php        # フォーム作成・更新
 ├── list.php        # フォーム一覧取得
 ├── detail.php      # フォーム詳細取得
 ├── delete.php      # フォーム削除
 └── database.sqlite # SQLite本体（自動生成）

---

## 🗄 データベース構造

### forms テーブル

| カラム       | 型      | 内容             |
|--------------|---------|------------------|
| id           | TEXT    | フォームID       |
| title        | TEXT    | フォームタイトル |
| description  | TEXT    | 説明             |
| fields       | TEXT    | 項目（JSON）     |

---

### answers テーブル（将来用）

id INTEGER PRIMARY KEY AUTOINCREMENT  
form_id TEXT  
field_id TEXT  
value TEXT  
created_at DATETIME DEFAULT CURRENT_TIMESTAMP  

---

## 🚀 API一覧

### フォーム作成・更新
POST /save.php

Request:
{
  "id": "optional",
  "title": "タイトル",
  "description": "説明",
  "fields": [
    {
      "id": "1",
      "label": "名前",
      "type": "text"
    }
  ]
}

Response:
{
  "status": "success",
  "id": "xxx"
}

---

### フォーム一覧取得
GET /list.php

---

### フォーム詳細取得
GET /detail.php?id=xxx

---

### フォーム削除
POST /delete.php

Request:
{
  "id": "xxx"
}

Response:
{
  "status": "success",
  "message": "削除しました"
}

---

## ⚠ 注意点

- SQLiteはローカルファイルとして保存される
- 初回アクセス時に自動でテーブル作成
- CORSは開発用で全許可

---

## 🧠 設計思想

- シンプルなJSON API
- 最小構成で動作するフォームエンジン
- fieldsは柔軟なJSON構造

---

## 📌 今後の拡張

- 回答送信API（submit.php）
- 回答一覧
- 認証機能
- 公開URL機能