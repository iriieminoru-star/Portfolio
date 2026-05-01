# 進捗レポート（2026/04/26）

## ■ プロジェクト概要
ノーコードでフォームを作成し、
入力・保存・一覧・CSV出力まで行える業務支援ツールを開発中

---

## ■ 技術構成
フロント：Next.js / React / TypeScript  
バックエンド：PHP（XAMPP）  
データ保存：JSON（data.json）※後にSQLite予定  

---

## ■ 完了機能

### 【フロント】
・/createページ作成  
・フォーム入力UI（title / description）  
・useStateによる状態管理  
・fetchによるPOST送信  
・APIレスポンスによる分岐処理  
・エラーメッセージ表示対応  

---

### 【バックエンド】
・save.php（データ保存API）
  - JSON受信
  - CORS対応
  - OPTIONS対応
  - バリデーション（未入力チェック）
  - data.jsonへの保存
  - エラーハンドリング

・list.php（一覧取得API）
  - data.json読み込み
  - JSON返却
  - エラー耐性あり

---

### 【データ】
・data.jsonへの永続化成功  
・追記形式で保存  
・日本語対応（UTF-8）  

---

## ■ 技術的に重要な学習ポイント

・CORSの理解  
・fetch + JSON通信の流れ  
・PHPでのJSON処理  
・バリデーション（入力チェック）  
・エラー原因特定（Unexpected token <）  
・PHP WarningがJSONを壊す問題  
・防御的プログラミング（初期化・型チェック）  

---

## ■ 現在の状態

フォーム入力 → API送信 → 保存 → レスポンス → 表示  
の一連の流れが完成

→ 「動くアプリ」として成立

---

## ■ 未実装（次工程）

① 一覧表示（画面への反映）  
② CSV出力機能  
③ SQLite化（DB化）  

---

## ■ 完成度

約 60〜70%

---

## ■ 次の予定

一覧表示 → CSV出力 → SQLite化

2026/04/27 15:30
# Next.js + PHP CRUD（JSON版）

このプロジェクトは、Next.js（フロント）とPHP（バックエンド）を使ったシンプルなCRUDアプリです。
データベースは使用せず、JSONファイル（data.json）でデータを管理しています。

---

## 技術構成

- フロントエンド：Next.js（React / use client）
- バックエンド：PHP
- データ保存：data.json（ファイルベース）

---

## 機能一覧

### ✔ Create（作成）
- フォームからデータ送信
- PHP（save.php）で受信
- uniqid()でIDを付与して保存

### ✔ Read（一覧表示）
- list.phpでJSON読み込み
- Next.jsで一覧表示
- データがない場合は「データがありません」と表示

### ✔ Delete（削除）
- delete.phpでIDを受け取り削除
- フロントからボタンで削除
- state更新で即時反映

---

## データ構造

```json
[
  {
    "id": "69eefa690a735",
    "title": "テスト１",
    "description": "テスト１です"
  }
]

【2026/05/01】
# ノーコードフォーム作成ツール

## 概要
ノーコードでフォームを作成し、
入力・保存・一覧・編集・削除・CSV出力まで行える
小規模業務支援ツールです。

ポートフォリオとして開発しています。

---

## 機能一覧

- フォーム作成（Create）
- 一覧表示（Read）
- 編集（Update）
- 削除（Delete）
- CSV出力
- バリデーション（未入力チェック）
- エラー / 成功メッセージ表示

---

## 技術構成

### フロントエンド
- Next.js
- React
- TypeScript

### バックエンド
- PHP（XAMPP）

### データ
- JSON（data.json）

---

## ディレクトリ構成

### フロント
no-code-pj/


### バックエンド
C:\xampp\htdocs\no-code-api\backend


※ シンボリックリンクで接続

---

## 起動方法

### ① XAMPP起動
- Apache を ON

### ② Next.js起動
cd no-code-pj
npm run dev


### ③ アクセス
http://localhost:3000/create


---

## APIエンドポイント

### GET
/save.php
/update.php
/delete.php


---

## CSV出力
/export.php


---

## 現在の課題

- UIの統一（create / list）
- ナビゲーションの整備
- ノーコードUIの実装

---

## 今後の展望

- フォーム項目の動的生成（ノーコード化）
- ドラッグ＆ドロップUI
- SQLiteへの移行
- 認証機能の追加

---

## 制作背景

業務で使える簡易ツールを想定し、
ノーコードで扱えるフォーム作成機能を目指しています。

---

## 作者
入家稔