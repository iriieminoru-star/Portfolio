<?php
header("Content-Type: application/json");

<<<<<<< HEAD
// CORS設定
=======
// デバッグON（本番ではOFFにする）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// JSONレスポンス
>>>>>>> 232f0193a481d997ca2905df3165ec20bd13cc2a
header("Content-Type: application/json");

// CORS（開発用）
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// プリフライト対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

<<<<<<< HEAD
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
=======
// ========================
// JSON受信
// ========================
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// JSONチェック
if (!is_array($data)) {
    echo json_encode([
        "status" => "error",
        "message" => "invalid json"
    ]);
    exit();
}

// ========================
// 値取得
// ========================
$id = $data["id"] ?? "";
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";

// 入力チェック
if ($id === "" || $title === "" || $description === "") {
    echo json_encode([
        "status" => "error",
        "message" => "未入力があります"
    ]);
    exit();
}

// ========================
// ファイル処理
// ========================
$file = "data.json";
>>>>>>> 232f0193a481d997ca2905df3165ec20bd13cc2a

if (!file_exists($file)) {
    echo json_encode([
        "status" => "error",
        "message" => "データが存在しません"
    ]);
    exit();
}

// 読み込み
$json = file_get_contents($file);
$list = json_decode($json, true);

<<<<<<< HEAD
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
=======
if (!is_array($list)) {
    $list = [];
}

// ========================
// 更新処理
// ========================
$found = false;

foreach ($list as &$item) {
    if ($item["id"] === $id) {
        $item["title"] = $title;
        $item["description"] = $description;
        $found = true;
        break;
    }
}

// IDが見つからない
if (!$found) {
    echo json_encode([
        "status" => "error",
        "message" => "データが見つかりません"
    ]);
    exit();
}

// ========================
// 保存
// ========================
$result = file_put_contents(
    $file,
    json_encode($list, JSON_UNESCAPED_UNICODE)
);

if ($result === false) {
    echo json_encode([
        "status" => "error",
        "message" => "保存失敗"
    ]);
    exit();
}

// ========================
// 成功レスポンス
// ========================
echo json_encode([
    "status" => "success",
    "title" => $title,
    "description" => $description
]);
>>>>>>> 232f0193a481d997ca2905df3165ec20bd13cc2a
