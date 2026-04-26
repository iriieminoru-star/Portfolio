<?php

// JSON形式で返す
header("Content-Type: application/json");

// CORS許可（フロントからのアクセスするため）
header("Access-Control-Allow-Origin: *");

// 保存ファイル
$file =~ "data.json";

$list = [];

// ファイルがなければ～配列
if (!file_exists($file)) {
  echo json_encode([]);
  exit();
}

// JSONで返す
$json = file_get_contents($file);
echo $json;