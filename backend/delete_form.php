<?php
header("Content-Type: application/json");

// ★ JSONとして受け取る（ここが重要）
$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

// デバッグ（超重要）
file_put_contents("debug.log", $raw . PHP_EOL, FILE_APPEND);

$form_id = $input["form_id"] ?? null;

if (!$form_id) {
    echo json_encode([
        "status" => "error",
        "message" => "id is required",
        "raw" => $raw
    ]);
    exit;
}

$db = new SQLite3("database.sqlite");

// answers削除
$stmt1 = $db->prepare("
    DELETE FROM answers WHERE form_id = :form_id
");
$stmt1->bindValue(":form_id", $form_id, SQLITE3_TEXT);
$stmt1->execute();

// forms削除
$stmt2 = $db->prepare("
    DELETE FROM forms WHERE id = :id
");
$stmt2->bindValue(":id", $form_id, SQLITE3_TEXT);
$stmt2->execute();

echo json_encode([
    "status" => "success",
    "deleted_id" => $form_id
]);