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

// ==============================
// DB接続
// ==============================
require_once(__DIR__ . "/db.php");

try {

  // ==============================
  // GETパラメータ取得
  // ==============================
  $formId = $_GET["id"] ?? null;

  // ==============================
  // バリデーション
  // ==============================
  if (!$formId) {
    echo json_encode([
      "status" => "error",
      "message" => "idがありません"
  ]);
    exit;
  }

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
    ":form_id" => $formId
  ]);

  $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // ==============================
  // 成功レスポンス
  // ==============================
  echo json_encode([
    "status" => "success",
    "answers" => $answers
  ]);

} catch (Exception $e) {

  // ==============================
  // エラー
  // ==============================
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}