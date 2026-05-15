<?php

function getDB() {
  // ★絶対パス固定（ここ重要）
  $dbPath = __DIR__ . "/database.sqlite";

  try {
    $pdo = new PDO("sqlite:" . $dbPath);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // =================================
    // フォーム定義テーブル
    // =================================
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS forms (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        fields TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    ");

    // =================================
    // 回答データテーブル
    // =================================
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form_id TEXT NOT NULL,
        field_id TEXT NOT NULL,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    ");

    // =================================
    // ノーコードフロー保存
    // =================================
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS flows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        form_id TEXT UNIQUE,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    ");

    return $pdo;

  } catch (Exception $e) {
    die("DB接続エラー: " . $e->getMessage());
  }
}