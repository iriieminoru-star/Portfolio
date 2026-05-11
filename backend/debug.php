<?php

require_once(__DIR__ . "/db.php");

$pdo = getDB();

// ==============================
// エラーハンドリング有効化
// ==============================
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ==============================
// データ取得（最新100件制限）
// ==============================
try {

  $formStmt = $pdo->query("
    SELECT rowid, *
    FROM forms
    ORDER BY rowid DESC
    LIMIT 100
  ");
  $forms = $formStmt->fetchAll(PDO::FETCH_ASSOC);

  $answerStmt = $pdo->query("
    SELECT rowid, *
    FROM answers
    ORDER BY rowid DESC
    LIMIT 300
  ");
  $answers = $answerStmt->fetchAll(PDO::FETCH_ASSOC);
  echo "<pre>";
  print_r($answers[0]);
  echo "</pre>";

  } catch (Exception $e) {
  die("SQL Error: " . $e->getMessage());
}

// ==============================
// answers を form_id ごとに整理
// ==============================
$answersByForm = [];

foreach ($answers as $a) {
  $fid = $a['form_id'] ?? 'unknown';
  $answersByForm[$fid][] = $a;
}

// ==============================
// HTML出力開始
// ==============================
header("Content-Type: text/html; charset=utf-8");

echo "<style>
body { font-family: Arial; font-size: 13px; }
table { border-collapse: collapse; margin-bottom: 30px; }
th, td { border: 1px solid #ccc; padding: 4px 8px; }
th { background: #eee; }
.section { margin-bottom: 40px; }
.bad { color: red; font-weight: bold; }
.good { color: green; font-weight: bold; }
</style>";

// ==============================
// サマリー
// ==============================
echo "<div class='section'>";
echo "<h2>DB Debug Summary</h2>";
echo "Forms件数: " . count($forms) . "<br>";
echo "Answers件数: " . count($answers) . "<br>";
echo "</div>";

// ==============================
// forms一覧
// ==============================
echo "<div class='section'>";
echo "<h2>FORMS</h2>";
echo "<table>";
echo "<tr><th>id</th><th>title</th><th>created_at</th></tr>";

foreach ($forms as $f) {
  echo "<tr>";
  echo "<td>" . htmlspecialchars($f['id'] ?? '') . "</td>";
  echo "<td>" . htmlspecialchars($f['title'] ?? '') . "</td>";
  echo "<td>" . ($f['created_at'] ?? '') . "</td>";
  echo "</tr>";
}

echo "</table>";
echo "</div>";

// ==============================
// answers一覧（グルーピング）
// ==============================
echo "<div class='section'>";
echo "<h2>ANSWERS (grouped by form_id)</h2>";

foreach ($answersByForm as $form_id => $list) {

  echo "<h3>form_id: {$form_id} (" . count($list) . ")</h3>";

  echo "<table>";
  echo "<tr><th>rowid</th><th>value</th><th>created_at</th></tr>";

  foreach ($list as $a) {
    echo "<tr>";
    echo "<td>" . ($a['rowid'] ?? '') . "</td>";
    echo "<td>" . htmlspecialchars($a['value'] ?? '') . "</td>";
    echo "<td>" . ($a['created_at'] ?? '') . "</td>";
    echo "</tr>";
  }

  echo "</table>";
}

echo "</div>";

// ==============================
// 不整合チェック（重要）
// ==============================
echo "<div class='section'>";
echo "<h2>Integrity Check</h2>";

$form_ids = array_column($forms, 'id');

foreach ($answers as $a) {
  $fid = $a['form_id'] ?? null;

  if ($fid === null || !in_array($fid, $form_ids)) {
    echo "<div class='bad'>孤立answer検出: answer rowid=" . ($a['rowid'] ?? '') . " form_id=" . htmlspecialchars($fid) . "</div>";
  }
}

echo "<div class='good'>チェック完了</div>";
echo "</div>";