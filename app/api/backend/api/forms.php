<?php

require_once(__DIR__ . "/../db.php");

header("Content-Type: application/json; charset=utf-8");

$pdo = getDB();

try {
  $stmt = $pdo->query("
    SELECT *
    FROM forms
    ORDER BY ROWID DESC
  ");

  $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "status" => "success",
    "forms" => $forms
  ]);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}