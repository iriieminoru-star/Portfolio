# ノーコード風フォームCRUDシステム

## 概要
このプロジェクトは、フォームから入力したデータをPHPで受け取り、JSONファイルに保存するシンプルなCRUD（作成・更新）システムです。

フロントエンド・バックエンド・JSON保存の流れを学習するために作成したミニアプリです。

---

## 使用技術

- フロントエンド：HTML / JavaScript
- バックエンド：PHP
- データ保存：JSONファイル（data.json）
- 通信：fetch API

---

## 機能

### ■ データ送信（Create / Update）
- フォーム（frontend/form.html）からデータ送信
- JavaScriptのfetchでPHPへ送信
- backend/update.phpで受信処理
- data.jsonに保存または更新

---

### ■ デバッグ機能
- 送信データをコンソールに表示
- 画面上にもJSONを表示
- API通信の流れを可視化

---

### ■ 旧構成の整理
- 旧実装（answers.php関連）は _old フォルダに退避
- 現行システムと分離して管理

---

## ディレクトリ構成

frontend/
└── form.html（入力フォーム）

backend/
├── update.php（API処理）
└── data.json（データ保存）

_old/
└── 旧ファイル（未使用・保管用）

---

## データの流れ

frontend/form.html  
　↓（fetch通信）  
backend/update.php  
　↓  
backend/data.json  

---

## backend/update.php の処理内容

- JSONデータを受け取る
- 必須項目チェック（id / title / description）
- data.jsonを読み込み
- idが一致する場合は更新
- 存在しない場合は新規追加
- JSONとして保存

---

## 送信データ例

{
  "id": "ユニークID",
  "title": "タイトル",
  "description": "説明"
}

---

## 現在の完成状態

- フォーム送信：完了
- API通信：完了
- JSON保存：完了
- 作成機能（Create）：完了
- 更新機能（Update）：完了
- デバッグ機能：完了
- 旧構成整理：完了

---

## 今後の拡張予定

- 一覧表示機能（list.php）
- フロント一覧画面（list.html）
- 削除機能（delete.php）
- 編集画面の実装
- データベース化（MySQLなど）

---

## 学習目的

このプロジェクトは以下を学ぶために作成：

- フロントエンドとバックエンドの連携
- fetchによるAPI通信
- PHPでのJSON処理
- CRUDの基本構造
- デバッグによる処理の可視化

---

## 状態

ミニCRUDアプリとして動作する状態まで完成済み