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
  // フォーム一覧取得
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