<?php

header("Content-Type: application/json");

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    http_response_code(200);
    exit();
}

// JSON受信
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// index取得
$id = $data['id'] ?? null;

if ($id === null) {
    echo json_encode([
        'status' => 'error',
        'message' => 'IDがありません。'
    ]);
    exit();
}

$file = __DIR__ . '/data.json';

if (!file_exists($file)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'データファイルが見つかりません。'
    ]);
    exit();
}

// 読み込み
$json = file_get_contents($file);
$items = json_decode($json, true);

// idで削除
$items = array_values(array_filter($items, function ($item) use ($id) {
    return isset($item['id']) && $item['id'] != $id;
}));


// 保存
file_put_contents($file, json_encode($items, JSON_UNESCAPED_UNICODE));

echo json_encode([
    'status' => 'success',
    'message' => '削除しました。'
]);
