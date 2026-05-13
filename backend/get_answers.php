<?php
// ==============================
// エラー表示（開発用）
// ==============================
ini_set('display_errors',1);
error_reporting(E_ALL);

// ==============================
// CORS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// プリフライト対策
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
    http_response_code(200);
}

// ==============================
// DB接続(SQLite)
// ==============================
require_once(__DIR__ . "/db.php");

try {
    $pdo = getDB();
    //$pdo->exec("SET NAMES utf8mb4");

  // ==============================
  // form_id取得
  // ==============================
  $form_id = $_GET["form_id"] ?? null;

  if (!$form_id) {
    echo json_encode([
        "status" => "error",
        "message" => "form_idが必要です"
    ]);
    exit;
  }
  // ==============================
  // フォーム存在確認
  // ==============================
  $formStmt = $pdo->prepare("
  SELECT id, title, description
  FROM forms
  WHERE id = :id
  ");

  $formStmt->execute([
    ":id" => $form_id
  ]);
  $form = $formStmt->fetch(PDO::FETCH_ASSOC);

  if (!$form) {
    echo json_encode([
      "status" => "error",
      "message" => "フォームが存在しません"
    ]);
    exit;
  }
  // ==============================
  // 回答取得（生データ）
  // ==============================
  $stmt = $pdo->prepare("
    SELECT
      form_id,
      field_id,
      value,
      created_at
    FROM answers
    WHERE form_id = :form_id
    ORDER BY created_t DESC
  ");

  $stmt->execute([
    ":form_id" => $form_id
  ]);

  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ==============================
  // グルーピング（1送信 = 1回答セット）
  // ==============================
  $grouped = [];

  foreach ($rows as $row) {

    $time = $row["created_at"];

    // 送信単位でまとめる
    if (!isset($grouped[$time])) {
      $grouped[$time] = [
        "created_at" => $time,
        "answers" => []
      ];
    }
    $grouped[$time]["answers"][$row["field_id"]] = $row["vlue"];
  }

  // ==============================
  // レスポンス
  // ==============================
  echo json_encode([
    "status" => "success",
    "form" => $form,
    "responses" => array_values($grouped)
  ]);
  exit;

} catch (Throwable $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);

  exit;
}