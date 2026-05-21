<?php

header("Content-Type: application/json");

try {

    // =========================
    // DB読み込み
    // =========================

    require_once __DIR__ . "/db.php";

    // ★これが必要
    $pdo = getDB();

    // =========================
    // JSON受信
    // =========================

    $raw = file_get_contents("php://input");

    $data = json_decode($raw, true);

    if (!$data) {

        echo json_encode([
            "status" => "error",
            "message" => "json decode failed",
            "raw" => $raw
        ]);

        exit;
    }

    // =========================
    // form_id取得
    // =========================

    $form_id = $data["form_id"] ?? "";

    if ($form_id === "") {

        echo json_encode([
            "status" => "error",
            "message" => "id is required"
        ]);

        exit;
    }

    // =========================
    // answers削除
    // =========================

    $stmt = $pdo->prepare("
        DELETE FROM answers
        WHERE form_id = :form_id
    ");

    $stmt->execute([
        ":form_id" => $form_id
    ]);

    // =========================
    // forms削除
    // =========================

    $stmt = $pdo->prepare("
        DELETE FROM forms
        WHERE id = :id
    ");

    $stmt->execute([
        ":id" => $form_id
    ]);

    // =========================
    // 成功
    // =========================

    echo json_encode([
        "status" => "success"
    ]);

} catch (Throwable $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}