# no-code-pj

フォーム作成・回答管理を中心としたフルスタック学習プロジェクト（Next.js + PHP + SQLite）

---

# 🚀 概要

このプロジェクトは、フォーム作成から回答保存・一覧表示までを一貫して扱う学習用フルスタックアプリです。

- フロントエンド：Next.js（App Router）
- バックエンド：PHP API
- DB：SQLite

---

# 🧩 主な機能

- フォーム作成
- フォーム編集
- フォーム削除
- フォーム一覧表示
- 回答入力ページ
- 回答送信
- SQLite保存
- debug.phpによるDB可視化
- CRUD構成

---

# 🧱 技術構成

| 項目 | 技術 |
|---|---|
| Frontend | Next.js |
| Language | TypeScript |
| Backend | PHP |
| Database | SQLite |
| Routing | App Router |
| Version Control | Git |

---

# 📁 現在のフォルダ構成（重要）

```txt
Portfolio/
└── no-code-pj/
    ├── app/
    │   ├── create/
    │   │   └── page.tsx
    │   ├── list/
    │   │   └── page.tsx
    │   ├── form/
    │   │   └── [id]/
    │   │       └── page.tsx
    │   └── answers/
    │       └── [id]/
    │           └── page.tsx
    │
    ├── backend/
    │   ├── save.php
    │   ├── submit.php
    │   ├── detail.php
    │   ├── answers.php
    │   ├── debug.php
    │   ├── db.php
    │   └── database.sqlite
    │
    ├── frontend/
    │   └── frontend.html
    │
    └── README.md
```

---

# ⚠️ フォルダ構成ルール（超重要）

## appフォルダはまだ移動しない

現在：

```txt
Portfolio/no-code-pj/app
```

にNext.js App Router構成を置いている。

過去に何度も、

- frontendへ移動するべきか
- srcへ移動するべきか
- appを整理するべきか

という議論が発生した。

しかし現時点では、

## 「動作安定を優先」

としている。

そのため、

# 今は appフォルダを移動しない

これが現在の正式ルール。

---

# 🧪 現在動作確認済みの機能

## createページ

```txt
http://localhost:3000/create
```

### 動作確認済み

- フォーム作成
- 項目追加
- 項目並び替え
- 保存
- 一覧表示
- 入力ページ遷移

---

## form/[id]

例：

```txt
http://localhost:3000/form/xxxx
```

### 動作確認済み

- detail.phpからフォーム取得
- 入力フォーム生成
- submit.phpへ送信
- SQLite保存成功

---

# 🗄 DB設計（現在）

## formsテーブル

| column | 内容 |
|---|---|
| id | フォームID |
| title | フォーム名 |
| description | 説明 |
| fields | JSON項目 |
| created_at | 作成日時 |

---

## answersテーブル

| column | 内容 |
|---|---|
| id | 回答ID |
| form_id | フォームID |
| field_id | 項目ID |
| value | 回答内容 |
| created_at | 作成日時 |

---

# 🧪 debug.php（超重要）

## 用途

SQLite内部状態を可視化するためのデバッグページ。

確認できる：

- forms一覧
- answers一覧
- form_id整合性
- 保存確認
- created_at
- value
- rowid/id

---

## 現在の到達状況

## value表示成功

現在：

```php
echo "<td>" . htmlspecialchars($a['value'] ?? '') . "</td>";
```

へ修正済み。

---

## 現在未解決

### 1. Formsのcreated_atが表示されない

原因候補：

- formsテーブルにcreated_atカラムが無い
- SQLite側に初期値設定が無い

---

### 2. Answersのrowidが表示されない

現在：

```php
echo "<td>" . ($a['rowid'] ?? '') . "</td>";
```

が空。

しかしdebug冒頭では：

```php
Array
(
    [id] => 6
```

が表示されている。

つまり、

## answersテーブルは rowid ではなく id を持っている可能性が高い

次回確認事項：

```php
echo "<td>" . ($a['id'] ?? '') . "</td>";
```

へ変更して確認。

---

# 🧠 超重要：今回の学習ポイント

## formId と form_id 問題

以前：

```ts
formId: id
```

だったため、

PHP側：

```php
$form_id = $input["form_id"]
```

と一致せず、

## 「データ不足」

エラーが発生していた。

現在：

```ts
form_id: id
```

へ統一済み。

---

# ⚠️ answers.php 現在の問題

現在：

```sql
INNER JOIN questions
```

を使用しているが、

## questionsテーブルは存在しない可能性が高い

現在の設計では：

- forms.fields(JSON)
- answers

のみ。

そのため、

## answers.phpは次回修正予定

---

# 📌 次回優先タスク

## 優先度A

### debug.php修正

- Forms.created_at表示
- Answers.id表示

---

## 優先度B

### answers.php修正

現在：

```sql
INNER JOIN questions
```

を削除予定。

---

## 優先度C

### app/answers/[id]/page.tsx修正

現在問題あり：

- formatBalue typo
- formatValue未定義
- switch構文ミス
- answers.php仕様変更追従

---

# 🧪 Git運用での学習（重要）

本プロジェクトではGit運用改善も実施。

## 発生した問題

- detached HEAD
- pull conflict
- backup無限ネスト
- .next混入

---

## 改善内容

- .gitignore整備
- backup除外
- branch確認徹底
- ローカル優先同期

---

# 🛡 .gitignore

```gitignore
node_modules/
.next/
backup/
.env
```

---

# 🧠 学習ポイント

- CRUD設計
- Next.js + PHP API連携
- SQLite操作
- JSON API
- TypeScript型管理
- Git運用
- App Router
- debug.phpによる可視化デバッグ

---

# 📌 今後の改善予定

- answersページ完成
- CSV出力
- バリデーション
- UI改善
- 認証
- API整理
- Docker化
- CI/CD
