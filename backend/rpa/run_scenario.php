<?php

header("Content-Type: application/json");

$id = $_GET["id"] ?? null;

if (!$id) {
  echo json_encode([
    "status" => "error",
    "message" => "id required"
  ]);
  exit;
}

/* =========================
   シナリオ取得
========================= */
$jsonFile = __DIR__ . "/scenarios.json";
$scenarios = json_decode(file_get_contents($jsonFile), true) ?? [];

$scenario = null;

foreach ($scenarios as $s) {
  if ($s["id"] === $id) {
    $scenario = $s;
    break;
  }
}

if (!$scenario) {
  echo json_encode([
    "status" => "error",
    "message" => "scenario not found"
  ]);
  exit;
}

/* =========================
   Node.js Playwright実行
========================= */
$stepsJson = escapeshellarg(json_encode($scenario["steps"]));

$cmd = "node " . __DIR__ . "/runner.js " . $stepsJson;

$output = shell_exec($cmd);

/* =========================
   結果返却
========================= */
echo json_encode([
  "status" => "success",
  "result" => $output
]);