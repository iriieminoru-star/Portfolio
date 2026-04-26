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

