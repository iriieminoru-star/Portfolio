<?php

header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 0);
error_reporting(0);

$raw = file_get_contents("php://input");

// デバッグ
file_put_contents(__DIR__ . "/debug_raw.txt", $raw);
file_put_contents(__DIR__ . "/where.txt", $jsonFile);

$data = json_decode($raw, true);

// ★ここが正しいチェック
if (json_last_error() !== JSON_ERROR_NONE) {
  echo json_encode([
    "status" => "error",
    "message" => "invalid json: " . json_last_error_msg(),
    "raw" => $raw
  ]);
  exit;
}

// ★追加（重要）
if (!is_array($data)) {
  echo json_encode([
    "status" => "error",
    "message" => "body is not JSON object"
  ]);
  exit;
}

$scenario_id = $data["scenario_id"] ?? null;
$name = $data["name"] ?? "unnamed";
$steps = $data["steps"] ?? [];

if (!$scenario_id) {
  echo json_encode([
    "status" => "error",
    "message" => "scenario_id required"
  ]);
  exit;
}

/* =========================
   JSON保存（安定版）
========================= */

$jsonFile = __DIR__ . "/scenarios.json";

if (!file_exists($jsonFile)) {
  file_put_contents($jsonFile, "[]");
}

$scenarios = json_decode(file_get_contents($jsonFile), true);

if (!is_array($scenarios)) {
  $scenarios = [];
}

$scenarios[] = [
  "scenario_id" => $scenario_id,
  "name" => $name,
  "steps" => $steps,
  "created_at" => date("c")
];

file_put_contents(
  $jsonFile,
  json_encode($scenarios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

/* =========================
   成功レスポンス
========================= */

echo json_encode([
  "status" => "success",
  "scenario_id" => $scenario_id
]);