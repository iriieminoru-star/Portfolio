# No-Code Survey App

フォームを作成し、回答を収集・閲覧できるシンプルなノーコード風アプリです。

---

# ■ 概要

このアプリは以下の流れで動作します：

1. フォームを作成する
2. URLを共有する
3. ユーザーが回答する
4. 回答を一覧で確認する

---

# ■ 技術スタック

## フロントエンド
- Next.js（App Router）
- React（use client）
- fetch API

## バックエンド
- PHP（API）
- SQLite（データベース）

---

# ■ 画面構成（ルーティング）

/
  トップページ（導線）

/create
  フォーム作成画面

/forms
  フォーム一覧

/forms/[id]
  フォーム詳細（未整備）

/answer/[formId]
  回答入力画面（未実装）

/forms/[id]/answers
  回答一覧（未実装）

---

# ■ 実装済み機能

## ✔ フォーム作成
- タイトル入力
- API経由でDB保存（forms.php）

## ✔ フォーム一覧表示
- 登録済みフォーム一覧取得

## ✔ トップページ
- フォーム作成への導線
- フォーム一覧への導線

## ✔ データベース
- formsテーブル
- answersテーブル（準備済み）

---

# ■ 未実装機能（重要）

## ❌ 回答機能
- 回答入力画面（/answer/[formId]）
- 回答保存API（answers登録）
- 回答一覧表示（/forms/[id]/answers）

---

# ■ データ構造

## formsテーブル
- id
- title
- created_at

## answersテーブル
- id
- form_id
- data（JSON）
- created_at

---

# ■ アーキテクチャ
Next.js（フロント）
↓ fetch
PHP API（forms.php / answers.php）
↓
SQLite DB


---

# ■ 現在の状態

- フォーム作成：完成
- フォーム一覧：完成
- 回答機能：未完成（ここが本体）

---

# ■ 次にやること

1. 回答入力画面（/answer/[formId]）
2. 回答保存API作成
3. 回答一覧画面
4. フォーム詳細ページ整備

---

# ■ 目的

このプロジェクトは最終的に：

👉 「URLを配るだけでアンケートが取れる仕組み」

を目指している