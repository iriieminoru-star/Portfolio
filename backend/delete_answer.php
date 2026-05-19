<?php

header("Content-Type: application/json");

try {

    require_once __DIR__ . "/db.php";

    $pdo = getDB();

    $raw = file_get_contents("php://input");

    $data = json_decode($raw, true);

    $id = $data["id"] ?? "";

    if ($id === "") {

        echo json_encode([
            "status" => "error",
            "message" => "id is required"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        DELETE FROM answers
        WHERE id = :id
    ");

    $stmt->execute([
        ":id" => $id
    ]);

    echo json_encode([
        "status" => "success"
    ]);

} catch (Throwable $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}