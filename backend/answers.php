<?php

// ==============================
// CORS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// ==============================
// DB接続
// ==============================
require_once(__DIR__ . "/db.php");

// ==============================
// form_id取得
// ==============================
$form_id = $_GET["form_id"] ?? "";

// デバッグ
error_log("form_id=[" . $form_id . "]");

// 空チェック
if (trim($form_id) === "") {
  echo json_encode([
    "status" => "error",
    "message" => "form_idなし"
  ]);
  exit;
}

try {

  $pdo = getDB();

  // ==============================
  // フォーム取得
  // ==============================
  $formStmt = $pdo->prepare("
    SELECT id, fields
    FROM forms
    WHERE id = :id
  ");

  $formStmt->execute([
    ":id" => $form_id
  ]);

  // ★ここ1回だけ（重要）
  $form = $formStmt->fetch(PDO::FETCH_ASSOC);

  // デバッグ
  error_log("form=" . json_encode($form ?? [], JSON_UNESCAPED_UNICODE));

  // フォーム存在確認
  if (!$form) {
    echo json_encode([
      "status" => "error",
      "message" => "フォームが存在しません"
    ]);
    exit;
  }

  // ==============================
  // fields(JSON)処理
  // ==============================
  $fields = json_decode($form["fields"], true);

  if (json_last_error() !== JSON_ERROR_NONE || !is_array($fields)) {
    $fields = [];
  }

  // ==============================
  // fieldマップ作成
  // ==============================
  $fieldMap = [];

  foreach ($fields as $f) {
    $fieldId = $f["id"] ?? "";
    $label = $f["label"] ?? "";

    if ($fieldId !== "") {
      $fieldMap[$fieldId] = trim($label);
    }
  }

  // ==============================
  // 回答取得
  // ==============================
  $stmt = $pdo->prepare("
    SELECT
      id,
      form_id,
      field_id,
      value,
      created_at
    FROM answers
    WHERE form_id = :form_id
    ORDER BY created_at DESC
  ");

  $stmt->execute([
    ":form_id" => $form_id
  ]);

  $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // ==============================
  // title付与
  // ==============================
  foreach ($answers as &$a) {

    $field_id = $a["field_id"] ?? "";

    $a["title"] = $fieldMap[$field_id] ?? "不明項目";
  }

  unset($a);

  // ==============================
  // 成功レスポンス
  // ==============================
  echo json_encode([
    "status" => "success",
    "answers" => $answers
  ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}