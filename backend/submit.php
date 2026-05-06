<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once(__DIR__ . "/db.php");

$input = json_decode(file_get_contents("php://input"), true);

$formId = $input["formId"] ?? null;
$answers = $input["answers"] ?? null;

if (!$formId || !$answers) {
  echo json_encode([
    "status" => "error",
    "message" => "データ不足"
  ]);
  exit;
}

try {
  $pdo = getDB();

  $stmt = $pdo->prepare("
    INSERT INTO answers (form_id, field_id, value)
    VALUES (:form_id, :field_id, :value) 
  ");
  
  foreach ($answers as $fieldId => $value) {
    $stmt->execute([
      ":form_id" => $formId,
      ":field_id" => $fieldId,
      ":value" => $value
    ]);
  }
  echo json_encode([
    "status" => "success"
  ]);
} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}