<?php
// ==============================
// エラー表示（開発用）
// ==============================
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ==============================
// CORS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// プリフライト対策
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// ==============================
// DB接続
// ==============================
require_once(__DIR__ . "/db.php");

// ==============================
// JSON受信
// ==============================
$input = json_decode(file_get_contents("php://input"), true);

$form_id = $input["form_id"] ?? null;
$answers = $input["answers"] ?? null;

// ==============================
// バリデーション
// ==============================
if (
  !$form_id ||
  !is_array($answers) ||
  empty($answers)
) {
  echo json_encode([
    "status" => "error",
    "message" => "データ不足"
  ]);
  exit;
}

try {

  $pdo = getDB();
  error_log("submit.php CALLED");

  // UTF-8対策
  //$pdo->exec("SET NAMES utf8mb4");

  // ==============================
  // フォーム存在確認
  // ==============================
  $checkStmt = $pdo->prepare("
    SELECT id
    FROM forms
    WHERE id = :id
  ");
  
  $checkStmt->execute([
    ":id" => $form_id
  ]);

  $form = $checkStmt->fetch(PDO::FETCH_ASSOC);

  if (!$form) {
    echo json_encode([
      "status" => "error",
      "message" => "フォームが存在しません"
    ]);
    exit;
  }

  // ==============================
  // transaction開始
  // ==============================
  $pdo->beginTransaction();

  // ==============================
  // 回答保存
  // ==============================
  $stmt = $pdo->prepare("
    INSERT INTO answers (
      form_id,
      field_id,
      value
    )
    VALUES (
      :form_id,
      :field_id,
      :value
    )
  ");

  foreach ($answers as $field_id => $value) {
    if (!is_string($field_id)) continue;

    if (is_array($value)) {
      $value = json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    $stmt->execute([
      ":form_id" => $form_id,
      ":field_id" => $field_id,
      ":value" => $value
    ]);
  }
  // ==============================
  // transaction確定
  // ==============================
  $pdo->commit();

    // ==============================
    // transaction確定（成功レスポンス）
    // ==============================
  echo json_encode([
    "status" => "success"
  ]);
  exit;

} catch (Exception $e) {

  // ==============================
  // transaction取り消し
  // ==============================
  if (isset($pdo) && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  
    // ==============================
    // エラー
    // ==============================
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}