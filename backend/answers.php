<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once(__DIR__ . "/db.php");

$form_id = $_GET["form_id"] ?? "";

if (trim($form_id) === "") {
  echo json_encode([
    "status" => "error",
    "message" => "form_idなし"
  ]);
  exit;
}

try {

  $pdo = getDB();
  $stmt =  $pdo->prepare("
  SELECT
    answers.id,
    answers.form_id,
    answers.field_id,
    answers.value,
    answers.created_at,
    answers.title
  from answers
  INNER JOIN questions
    ON answers.field_id = questions.id
  WHERE answers.form_id = :form_id
  ORDER BY answers.created_at DESC
  ");

  $stmt->execute([
    ":form_id" => $form_id
  ]);

  $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "status" => "success",
    "answers" => $answers
  ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}