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

$jsonFile = __DIR__ . "/scenarios.json";

if (!file_exists($jsonFile)) {
  echo json_encode([
    "status" => "error",
    "message" => "no scenarios found"
  ]);
  exit;
}

$scenarios = json_decode(file_get_contents($jsonFile), true) ?? [];

/* =========================
   ID検索
========================= */
$target = null;

foreach ($scenarios as $s) {
  if ($s["id"] === $id) {
    $target = $s;
    break;
  }
}

if (!$target) {
  echo json_encode([
    "status" => "error",
    "message" => "scenario not found"
  ]);
  exit;
}

/* =========================
   成功
========================= */
echo json_encode([
  "status" => "success",
  "scenario" => $target
]);