<?php

require_once(__DIR__ . "/db.php");

header("Content-Type: text/html; charset=utf-8");

$pdo = getDB();

// ==============================
// エラーハンドリング
// ==============================
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ==============================
// データ取得
// ==============================
try {

  // forms
  $formStmt = $pdo->query("
    SELECT rowid, *
    FROM forms
    ORDER BY rowid DESC
    LIMIT 100
  ");

  $forms = $formStmt->fetchAll(PDO::FETCH_ASSOC);

  // answers
  $answerStmt = $pdo->query("
    SELECT rowid, *
    FROM answers
    ORDER BY rowid DESC
    LIMIT 300
  ");

  $answers = $answerStmt->fetchAll(PDO::FETCH_ASSOC);

  // scenarios
  $scenarioStmt = $pdo->query("
    SELECT rowid, *
    FROM scenarios
    ORDER BY rowid DESC
    LIMIT 100
  ");

  $scenarios = $scenarioStmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {

  die("SQL Error: " . $e->getMessage());
}

// ==============================
// answers を form_id ごとに整理
// ==============================
$answersByForm = [];

foreach ($answers as $a) {

  $fid = (string)($a["form_id"] ?? "unknown");

  $answersByForm[$fid][] = $a;
}

// ==============================
// CSS
// ==============================
echo "
<style>

body {
  font-family: Arial;
  font-size: 13px;
  padding: 20px;
}

table {
  border-collapse: collapse;
  margin-bottom: 30px;
  width: 100%;
}

th,
td {
  border: 1px solid #ccc;
  padding: 6px 10px;
  text-align: left;
  vertical-align: top;
}

th {
  background: #eee;
}

.section {
  margin-bottom: 50px;
}

.bad {
  color: red;
  font-weight: bold;
}

.good {
  color: green;
  font-weight: bold;
}

.code {
  max-width: 500px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 11px;
}

</style>
";

// ==============================
// サマリー
// ==============================
echo "<div class='section'>";

echo "<h2>DB Debug Summary</h2>";

echo "Forms件数: " . count($forms) . "<br>";
echo "Answers件数: " . count($answers) . "<br>";
echo "Scenarios件数: " . count($scenarios) . "<br>";

echo "</div>";

// ==============================
// FORMS
// ==============================
echo "<div class='section'>";

echo "<h2>FORMS</h2>";

echo "<table>";

echo "
<tr>
  <th>id</th>
  <th>title</th>
  <th>created_at</th>
</tr>
";

foreach ($forms as $f) {

  echo "<tr>";

  echo "<td>"
    . htmlspecialchars((string)($f["id"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "<td>"
    . htmlspecialchars((string)($f["title"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "<td>"
    . htmlspecialchars((string)($f["created_at"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "</tr>";
}

echo "</table>";

echo "</div>";

// ==============================
// ANSWERS
// ==============================
echo "<div class='section'>";

echo "<h2>ANSWERS (grouped by form_id)</h2>";

foreach ($answersByForm as $form_id => $list) {

  echo "<h3>form_id: "
    . htmlspecialchars((string)$form_id, ENT_QUOTES, "UTF-8")
    . " (" . count($list) . ")</h3>";

  echo "<table>";

  echo "
  <tr>
    <th>id</th>
    <th>value</th>
    <th>created_at</th>
  </tr>
  ";

  foreach ($list as $a) {

    echo "<tr>";

    echo "<td>"
      . htmlspecialchars((string)($a["id"] ?? ""), ENT_QUOTES, "UTF-8")
      . "</td>";

    echo "<td>"
      . htmlspecialchars((string)($a["value"] ?? ""), ENT_QUOTES, "UTF-8")
      . "</td>";

    echo "<td>"
      . htmlspecialchars((string)($a["created_at"] ?? ""), ENT_QUOTES, "UTF-8")
      . "</td>";

    echo "</tr>";
  }

  echo "</table>";
}

echo "</div>";

// ==============================
// SCENARIOS
// ==============================
echo "<div class='section'>";

echo "<h2>SCENARIOS</h2>";

echo "<table>";

echo "
<tr>
  <th>id</th>
  <th>name</th>
  <th>code</th>
  <th>created_at</th>
</tr>
";

foreach ($scenarios as $s) {

  echo "<tr>";

  echo "<td>"
    . htmlspecialchars((string)($s["id"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "<td>"
    . htmlspecialchars((string)($s["name"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "<td class='code'>"
    . htmlspecialchars((string)($s["code"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "<td>"
    . htmlspecialchars((string)($s["created_at"] ?? ""), ENT_QUOTES, "UTF-8")
    . "</td>";

  echo "</tr>";
}

echo "</table>";

echo "</div>";

// ==============================
// Integrity Check
// ==============================
echo "<div class='section'>";

echo "<h2>Integrity Check</h2>";

$form_ids = array_column($forms, "id");

foreach ($answers as $a) {

  $fid = $a["form_id"] ?? null;

  if ($fid === null || !in_array($fid, $form_ids, true)) {

    echo "<div class='bad'>";

    echo "孤立answer検出: answer id="
      . htmlspecialchars((string)($a["id"] ?? ""), ENT_QUOTES, "UTF-8")
      . " form_id="
      . htmlspecialchars((string)$fid, ENT_QUOTES, "UTF-8");

    echo "</div>";
  }
}

echo "<div class='good'>チェック完了</div>";

echo "</div>";