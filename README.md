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

2026/04/30 20:58
# ノーコード業務ツール（ポートフォリオ）

## 概要
ノーコードでフォームを作成し、  
データの登録・一覧表示・編集・削除ができる  
小規模業務支援ツールを開発中。

---

## 技術構成

### フロントエンド
- Next.js
- React
- TypeScript

### バックエンド
- PHP（XAMPP）

### データ保存
- JSONファイル（data.json）
- ※将来的にSQLiteへ移行予定

---

## ディレクトリ構成
no-code-pj/
├─ app/
│ ├─ create/
│ │ └─ page.tsx
│ └─ no-code-api/
│ └─ backend/
│ ├─ data.json
│ ├─ save.php
│ ├─ list.php
│ ├─ delete.php
│ └─ update.php


※ 実際のAPIは以下に配置

C:\xampp\htdocs\no-code-api\backend


シンボリックリンクで連携：

mklink /D C:\xampp\htdocs\no-code-api\backend C:\Users\iriie\OneDrive\デスクトップ\ポートフォリオ\no-code-pj\app\no-code-api\backend


---

## 実装済み機能

### ① Create（作成）
- フォーム入力（title / description）
- save.phpにPOST送信
- data.jsonに保存
- uniqid()でID付与

---

### ② Read（一覧表示）
- list.phpでJSON取得
- 画面に一覧表示
- データ0件時は「データがありません」

---

### ③ Update（編集）
- 編集ボタンでフォームに値セット
- update.phpでIDベース更新
- 更新後は一覧再取得

---

### ④ Delete（削除）
- 削除ボタン
- delete.phpでID削除
- state更新で即反映

---

## API一覧

### save.php
- 新規データ保存

### list.php
- 一覧取得

### update.php
- ID指定で更新

### delete.php
- ID指定で削除

---

## 動作手順（重要）

### ① XAMPP起動
- Apacheを起動する

※これをやらないと以下エラーになる
TypeError: Failed to fetch
ERR_CONNECTION_REFUSED


---

### ② API確認
ブラウザで確認：

http://localhost/no-code-api/backend/list.php


→ JSONが表示されればOK

---

### ③ フロント起動

npm run dev


※トップページではなく create にアクセスすること

---

## ハマったポイント

### ① 保存できない
→ 原因：XAMPP未起動

---

### ② 404エラー
→ 原因：PHPがhtdocs配下にない

---

### ③ Failed to fetch
→ 原因：
- Apache未起動
- URLミス
- CORS

---

### ④ VSCodeで保存忘れ
→ Git差分が出ない原因

---

## 現在の到達点

- CRUDすべて完成（Create / Read / Update / Delete）
- フロントとPHPの連携完了
- JSONによる簡易DB構築済み

---

## 今後の予定

- CSV出力機能
- フォーム項目の動的生成（ノーコード化）
- SQLite移行
- UI改善

---

## メモ

- Next.jsはフロント専用
- PHPはAPIサーバーとして利用
- ローカル環境（localhost）で動作

---

## 進捗

約70%完了（基盤完成フェーズ）

---

## 作者

ポートフォリオ制作中

