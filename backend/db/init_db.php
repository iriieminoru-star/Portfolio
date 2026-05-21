<?php
// ==============================
// DB初期化スクリプト
// ==============================
// ・SQLite DBを生成
// ・forms / answers / scenarios を作成
// ・scenarios.jsonも生成対象にする前提

$dbPath = __DIR__ . "/database.sqlite";

try {
    // ==============================
    // DB接続
    // ==============================
    $pdo = new PDO("sqlite:" . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "DB接続成功\n";

    // ==============================
    // FORMS テーブル
    // ==============================
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS forms (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ");

    echo "forms OK\n";

    // ==============================
    // ANSWERS テーブル
    // ==============================
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            form_id TEXT NOT NULL,
            field_id TEXT NOT NULL,
            value TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ");

    echo "answers OK\n";

    // ==============================
    // SCENARIOS テーブル（追加）
    // ==============================
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS scenarios (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            steps TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ");

    echo "scenarios OK\n";

    // ==============================
    // INDEX（高速化用）
    // ==============================
    $pdo->exec("
        CREATE INDEX IF NOT EXISTS idx_answers_form_id
        ON answers(form_id)
    ");

    $pdo->exec("
        CREATE INDEX IF NOT EXISTS idx_scenarios_id
        ON scenarios(id)
    ");

    echo "index OK\n";

    // ==============================
    // scenarios.json 生成（初期）
    // ==============================
    $jsonPath = __DIR__ . "/../scenarios.json";

    if (!file_exists($jsonPath)) {
        file_put_contents($jsonPath, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "scenarios.json created\n";
    } else {
        echo "scenarios.json already exists\n";
    }

    echo "INIT COMPLETE\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}