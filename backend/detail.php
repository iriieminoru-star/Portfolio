<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// ================================
// ID取得
// ================================
$id = $_GET['id'] ?? "";

if (trim($id) === "") {
  echo json_encode([
    "status" => "error",
    "message" => "idなし"
  ]);
  exit;
}

// ================================
// DB接続
// ================================
require_once(__DIR__ . "/db.php");

try {
  $pdo = getDB();

  // ================================
  // データ取得
  // ================================
  $stmt = $pdo->prepare("
    SELECT id, title, description, fields
    FROM forms
    WHERE id = :id
  ");
  $stmt->execute([":id" => $id]);

  $form = $stmt->fetch(PDO::FETCH_ASSOC);

  if(!$form) {
    echo json_encode([
      "status" => "error",
      "message" => "データなし"
    ]);
    exit;
  }

  // ================================
  // fieldsをJSON配列に戻す
  // ================================
  $fields = json_decode($form["fields"], true);

  if(!is_array($fields)) {
    $fields = [];
  }

  // ================================
  // レスポンス
  // ================================
  echo json_encode([
    "status" => "success",
    "id" => $form["id"],
    "title" => $form["title"],
    "description" => $form["description"],
    "fields" => $fields
  ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}