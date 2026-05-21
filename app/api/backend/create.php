<?php
header("Content-Type: application/json");

// JSON受け取り
$input = json_decode(file_get_contents("php://input"), true);

// 既存データ読み込み
$file = __DIR__ . "answers.json";

if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$data = json_decode(file_get_contents($file), true);

// 念のため配列保証
if (!is_array($data)) {
    $data = [];
}

// 追加
$data[] = [
    "id" => uniqid(),
    "form_id" => $input["form_id"] ?? null,
    "answers" => $input["answers"] ?? [],
    "created_at" => date("Y-m-d H:i:s")
];

// 保存
file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE));

// レスポンス
echo json_encode([
    "status" => "ok",
    "message" => "saved"
]);