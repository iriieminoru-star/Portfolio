<?php

// ==============================
// CORS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// ==============================
// DB接続
// ==============================
require_once(__DIR__ . "/db.php");

try {

  $pdo = getDB();

    // ==============================
  // 単体取得モード
  // GET forms.php?id=xxx
  // ==============================
  if (isset($_GET["id"])) {
    $id = $_GET["id"];
  

    $stmt = $pdo->prepare("
      SELECT
        id,
        title,
        fields,
        created_at
      FROM forms
      WHERE id = :id
    ");

    $stmt->bindValue(":id", $id, PDO::PARAM_STR);
    $stmt->execute();
    $form = $stmt->fetch(PDO::FETCH_ASSOC);

    // フォームが存在しない
    if (!$form) {
      echo json_encode([
        "status" => "error",
        "message" => "Form not found"
      ]);
      exit;
    }

    // fieldsをJSON→配列へ
    $form["fields"] = json_decode($form["fields"], true);
    
    echo json_encode([
      "status" => "success",
      "form" => $form
    ], JSON_UNESCAPED_UNICODE);
    exit;
  }

  // ==============================
  // 一覧取得モード
  // GET forms.php
  // ==============================
  $stmt = $pdo->prepare("
    SELECT
      id,
      title,
      created_at
    FROM forms
    ORDER BY created_at DESC
  ");

  $stmt->execute();
  $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ==============================
  // 成功レスポンス
  // ==============================
  echo json_encode([
    "status" => "success",
    "forms" => $forms
  ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    // ==============================
  // エラー
  // ==============================
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}