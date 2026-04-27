<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$id = $data["id"] ?? null;
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";

if (!$id) {
    echo json_encode(["status" => "error", "message" => "IDがありません。"]);
    exit();
}

$file = __DIR__ . "/data.json";

if (!file_exists($file)) {
    echo json_encode(["status" => "error", "message" => "データファイルが見つかりません。"]);
    exit();
}

$list = json_decode(file_get_contents($file), true);

file_put_contents($file, json_encode($list, JSON_UNESCAPED_UNICODE));

echo json_encode(["status" => "success"]);