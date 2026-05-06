<?php

function getDB() {
  $dbPath = __DIR__ . "/database.sqlite";

  try {
    $pdo = new PDO("sqlite:" . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // ================================
    // フォーム定義テーブル
  // ================================
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS forms (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        fields TEXT
      )
    ");

    // ================================
    // 回答データテーブル
    // ================================
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_id TEXT,
      field_id TEXT,
      value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    ");

    return $pdo;

  } catch (Exception $e) {
    die("DB接続エラー: " . $e->getMessage());
  }
}