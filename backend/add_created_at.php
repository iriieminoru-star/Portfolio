<?php

require_once(__DIR__ . "/db.php");

try {

$pdo = getDB();

$pdo->exec("
  ALTER TABLE forms
  ADD COLUMN created_at TEXT
");

echo "created_at追加成功";

} catch (Exception $e) {
  echo $e->getMessage();
}
