<?php
// ==============================
// エラー表示（開発用）
// ==============================
ini_set('display_error', 1);
error_reporting(E_ALL);

// ==============================
// CORS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// プリフライト対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
  }
// ==============================
// DB接続
// ==============================
require_once(__DIR__ . "/db.php");

try {
  $pdo = getDB();
  
  // ==============================
  // フォーム取得
  // ==============================
  $stmt = $pdo->prepare("
    SELECT
      id,
      title,
      description,
      created_at
    FROM forms
    ORDER BY created_at DESC
  ");
  $stmt->execute();
  $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // ==============================
  // レスポンス
  // ==============================
  echo json_encode([
    "status" => "success",
    "forms" => $forms
  ]);
  exit;
} catch (Throwable $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
  exit;
}
