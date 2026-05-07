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

$formId = $input["formId"] ?? null;
$answers = $input["answers"] ?? null;

// ==============================
// バリデーション
// ==============================
if (
  !$formId ||
  !is_array($answers) ||
  count($answers) === 0
) {
  echo json_encode([
    "status" => "error",
    "message" => "データ不足"
  ]);
  exit;
}

try {

  $pdo = getDB();

  // ==============================
  // フォーム存在確認
  // ==============================
  $checkStmt = $pdo->prepare("
    SELECT id
    FROM forms
    WHERE id = :id
  ");
  
  $checkStmt->execute([
    ":id" => $formId
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

  foreach ($answers as $fieldId => $value) {

    $stmt->execute([
      ":form_id" => $formId,
      ":field_id" => $fieldId,
      ":value" => $value
    ]);
  }
  // ==============================
  // transaction確定
  // ==============================
  $pdo->commit();

    // ==============================
    // 成功レスポンス
    // ==============================
  echo json_encode([
    "status" => "success"
  ]);

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