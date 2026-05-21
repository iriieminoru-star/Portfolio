<?php

header("Content-Type: application/json; charset=utf-8");

$jsonFile = __DIR__ . "/scenarios.json";

//デバッグ
file_put_contents(__DIR__ . "/where_list.txt", $jsonFile);

// ★ファイルが無い場合は作る（重要）
if (!file_exists($jsonFile)) {
  file_put_contents($jsonFile, "[]");
}

$data = file_get_contents($jsonFile);
$scenarios = json_decode($data, true);

// ★壊れてても安全化
if (!is_array($scenarios)) {
  $scenarios = [];
}

echo json_encode([
  "status" => "success",
  "scenarios" => $scenarios
]);