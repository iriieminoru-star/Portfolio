<?php
// ===== START: データ受信API（CORS対応） =====
header("Content-Type: application/json");

// CORS許可（超重要）
header("Access-Control-Allow-origin: *");
header("Access-Control-Headers: Content-Type");
header("Access-Control-Methods: POST, GET, OPTIONS");

// OPTIONS(プリフライト)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

// JSON受信
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// 安全チェック
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";

// 仮保存（今回はDBなしなのでログをえすだけ）
echo json_encode([
  "status" => "success",
  "title" => $title,
  "description" => $description
]);

// ===== END: データ受信API =====