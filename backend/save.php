<?php

// デバッグON（確認終わったらOFFに戻す）
ini_set('display_errors',1);
error_reporting(E_ALL);

// ==================================================
// データ受信API（Next.js → PHP 通信用）
// ==================================================

// レスポンスはJSONで返す
header("Content-Type: application/json");

// ==================================================
// CORS設定（フロントからの通信を許可）
// ==================================================

// どのオリジンからでもアクセス許可（開発用）
header("Access-Control-Allow-Origin: *");

// POST送信時のContent-Typeヘッダ許可
header("Access-Control-Allow-Headers: Content-Type");

// 許可するHTTPメソッド（POST + プリフライト対応）
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ==================================================
// プリフライトリクエスト（OPTIONS）対応
// ==================================================
// ブラウザが事前確認で送ってくるリクエスト
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==================================================
// JSONデータ受信処理
// ==================================================

// フロントから送られた生データをJSON取得
$input = file_get_contents("php://input");

// JSONをPHP配列に変換
$data = json_decode($input, true);

// ★JSONチェック
if (!is_array($data)) {
  echo json_encode(["status" => "error", "message" => "invalid json"]);
  exit();
}

// ==================================================
// 安全な値取得（未入力でもエラーにしない）
// ==================================================
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";

// ★入力チェック
if ($title === "" || $description === "") {
  echo json_encode([
    "status" => "error",
    "message" => "未入力があります。"
  ]);
  exit();
}

// 保存ファイル
$file = "data.json";

$list = [];

// 既存データ読みこみ
if (file_exists($file)) {
  $json = file_get_contents($file);
  $decoded = json_decode($json, true);

  if (is_array($decoded)) {
    $list = $decoded;
  }
}

// 新規追加
$list[] = [
  "title" => $title,
  "description" => $description
];

// 保存
$result = file_put_contents($file, json_encode($list, JSON_UNESCAPED_UNICODE));

if($result === false) {
  echo json_encode(["status" => "error", "message" => "save failed"]);
  exit();
}

// レスポンス
echo json_encode([
  "status" => "success",
  "title" => $title,
  "description" => $description
]);
// ===== END: データ受信API =====