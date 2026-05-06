<?php

// ================================
// レスポンス形式（JSON)
// ================================
header("Content-Type: application/json; charset=UTF-8");

// ================================
// CORS設定（フロントからのアクセス許可）
// ================================
// 開発用：本番はオリジン制限すること
header("Access-Control-Allow-Origin: *");

// ================================
// DB接続ファイル読み込み
// ================================
// db.php内でSQLite接続＆テーブル生成を行う
require_once(__DIR__ . "/db.php");

try {
  // ================================
  // DB接続
  // ================================
  $pdo = getDB();

  // ================================
  // フォーム一覧取得
  // ================================
  // ・id：フォーム識別子
  // ・title：フォーム名
  // ・description：説明
  // ※fieldsは一覧では不要なので取得しない（軽量化）
  $stmt = $pdo->query("
    SELECT id, title, description
    FROM forms
    ORDER BY rowid DESC
  ");

  // ================================
  // 結果を配列で取得
  // ================================
  $list = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // ================================
  // JSONで返却
  // ================================
  $json = json_encode($list, JSON_UNESCAPED_UNICODE);

  if($json === false) {
    throw new Exception("JSON変換に失敗しました");
  }

  echo $json;
  
} catch (Exception $e) {
  // ================================
  // エラー時レスポンス
  // ================================

  http_response_code(500);
  
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ], JSON_UNESCAPED_UNICODE);
}