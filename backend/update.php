<?php
header("Content-Type: application/json");

// CORS設定
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// リクエスト受け取り
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// データ取得
$id = $data["id"] ?? null;
$title = trim($data["title"] ?? "");
$description = trim($data["description"] ?? "");

// ★入力チェック
if (!$id) {
    echo json_encode(["status" => "error", "message" => "IDがありません。"]);
    exit();
}

if ($title === "" || $description === "") {
  echo json_encode([
    "status" => "error",
    "message" => "未入力があります。"
  ]);
  exit();
}

$file = __DIR__ . "/data.json";

if (!file_exists($file)) {
    echo json_encode(["status" => "error", "message" => "データファイルが見つかりません。"]);
    exit();
}

$list = json_decode(file_get_contents($file), true);

// 更新処理
// file_put_contents($file, json_encode($list, JSON_UNESCAPED_UNICODE));
foreach ($list as &$item) {
    if ($item["id"] == $id) {
        $item["title"] = $title;
        $item["description"] = $description;
        break;
    }
}

// 保存
file_put_contents($file, json_encode($list, JSON_UNESCAPED_UNICODE));

// レスポンス
echo json_encode(["status" => "success"]);