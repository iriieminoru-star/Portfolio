<?php

require_once "db.php";

$pdo = getDB();

// 全回答取得
$stmt = $pdo->query("
  SELECT form_id, field_id, value, created_at
  FROM answers
  ORDER BY created_at DESC
");

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ヘッダー（CSVダウンロード）
header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="answers.csv"');

// BOM（Excel対策）
echo "\xEF\xBB\xBF";

$output = fopen('php://output', 'w');

// ヘッダー行
fputcsv($output, ['form_id', 'field_id', 'value', 'created_at']);

// データ行
foreach ($rows as $row) {
    fputcsv($output, $row);
}

fclose($output);
exit;