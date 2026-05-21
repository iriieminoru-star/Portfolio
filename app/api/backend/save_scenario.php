<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}

header("Content-Type: application/json; charset=utf-8");

require_once(__DIR__ . "/db.php");

try {

  $pdo = getDB();

  $raw = file_get_contents("php://input");

  $data = json_decode($raw, true);

  $name = trim($data["name"] ?? "");
  $code = $data["code"] ?? "";

  if ($name === "") {
    throw new Exception("name empty");
  }

  if ($code === "") {
    throw new Exception("code empty");
  }

  $id = uniqid();

  $stmt = $pdo->prepare("
    INSERT INTO scenarios (
      id,
      name,
      code
    )
    VALUES (
      :id,
      :name,
      :code
    )
  ");

  $stmt->execute([
    ":id" => $id,
    ":name" => $name,
    ":code" => $code,
  ]);

  echo json_encode([
    "status" => "success",
    "id" => $id,
  ]);

} catch (Exception $e) {

  http_response_code(500);

  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage(),
  ]);
}