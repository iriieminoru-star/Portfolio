<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $db = new PDO('sqlite:' . __DIR__ . '/../database.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode([
            "status" => "error",
            "message" => "id is required"
        ]);
        exit;
    }

    $stmt = $db->prepare("
        SELECT * FROM forms WHERE id = :id
    ");

    $stmt->bindValue(':id', $id);
    $stmt->execute();

    $form = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$form) {
        echo json_encode([
            "status" => "error",
            "message" => "form not found"
        ]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "form" => $form
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}