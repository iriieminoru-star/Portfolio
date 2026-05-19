<?php
header("Content-Type: application/json");

$file = "scenarios.txt";

if (!file_exists($file)) {
  echo json_encode([]);
  exit;
}

$lines = file($file, FILE_IGNORE_NEW_LINES);

$result = [];

foreach ($lines as $line) {
  [$name, $code] = explode("|", $line);

  $result[] = [
    "name" => $name,
    "code" => $code
  ];
}

echo json_encode($result);