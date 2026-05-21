<?php

require_once(__DIR__ . "/db.php");

$pdo = getDB();

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// ==============================
// モード判定（HTML / JSON）
// ==============================
$isJson = isset($_GET["format"]) && $_GET["format"] === "json";

try {

  // ==============================
  // FORMS
  // ==============================
  $forms = $pdo->query("
    SELECT rowid, *
    FROM forms
    ORDER BY rowid DESC
    LIMIT 100
  ")->fetchAll(PDO::FETCH_ASSOC);

  // ==============================
  // ANSWERS
  // ==============================
  $answers = $pdo->query("
    SELECT rowid, *
    FROM answers
    ORDER BY rowid DESC
    LIMIT 300
  ")->fetchAll(PDO::FETCH_ASSOC);

  // ==============================
  // 🆕 RPA SCENARIOS
  // ==============================
  $rpaScenarios = $pdo->query("
    SELECT *
    FROM rpa_scenarios
    ORDER BY created_at DESC
    LIMIT 100
  ")->fetchAll(PDO::FETCH_ASSOC);

  // ==============================
  // 🆕 RPA STEPS
  // ==============================
  $rpaSteps = $pdo->query("
    SELECT *
    FROM rpa_steps
    ORDER BY id DESC
    LIMIT 300
  ")->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {
  die("SQL Error: " . $e->getMessage());
}

// ==============================
// answers group化
// ==============================
$answersByForm = [];

foreach ($answers as $a) {
  $fid = (string)($a['form_id'] ?? 'unknown');
  $answersByForm[$fid][] = $a;
}

// ==============================
// JSONモード（RPA用・API化）
// ==============================
if ($isJson) {
  header("Content-Type: application/json; charset=utf-8");

  echo json_encode([
    "forms_count" => count($forms),
    "answers_count" => count($answers),
    "rpa_scenarios_count" => count($rpaScenarios),
    "rpa_steps_count" => count($rpaSteps),

    "forms" => $forms,
    "answers" => $answersByForm,
    "rpa_scenarios" => $rpaScenarios,
    "rpa_steps" => $rpaSteps,

    "timestamp" => date("Y-m-d H:i:s")
  ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

  exit;
}

// ==============================
// HTMLモード
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
echo "RPA Scenarios: " . count($rpaScenarios) . "<br>";
echo "RPA Steps: " . count($rpaSteps) . "<br>";
echo "</div>";

// ==============================
// FORMS
// ==============================
echo "<div class='section'>";
echo "<h2>FORMS</h2>";
echo "<table>";
echo "<tr><th>id</th><th>title</th><th>created_at</th></tr>";

foreach ($forms as $f) {
  echo "<tr>";
  echo "<td>" . htmlspecialchars((string)($f['id'] ?? ''), ENT_QUOTES, 'UTF-8') . "</td>";
  echo "<td>" . htmlspecialchars((string)($f['title'] ?? ''), ENT_QUOTES, 'UTF-8') . "</td>";
  echo "<td>" . htmlspecialchars((string)($f['created_at'] ?? ''), ENT_QUOTES, 'UTF-8') . "</td>";
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

  echo "<h3>form_id: " . htmlspecialchars((string)$form_id, ENT_QUOTES, 'UTF-8')
    . " (" . count($list) . ")</h3>";

  echo "<table>";
  echo "<tr><th>rowid</th><th>value</th><th>created_at</th></tr>";

  foreach ($list as $a) {
    echo "<tr>";
    echo "<td>" . htmlspecialchars((string)($a['rowid'] ?? ''), ENT_QUOTES, 'UTF-8') . "</td>";
    echo "<td>" . htmlspecialchars((string)($a['value'] ?? ''), ENT_QUOTES, 'UTF-8') . "</td>";
    echo "<td>" . htmlspecialchars((string)($a['created_at'] ?? ''), ENT_QUOTES, 'UTF-8') . "</td>";
    echo "</tr>";
  }

  echo "</table>";
}

echo "</div>";

// ==============================
// 🆕 RPA SCENARIOS
// ==============================
echo "<div class='section'>";
echo "<h2>RPA SCENARIOS</h2>";

foreach ($rpaScenarios as $s) {
  echo "<div>";
  echo "ID: " . htmlspecialchars((string)($s['id'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "Name: " . htmlspecialchars((string)($s['name'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "Created: " . htmlspecialchars((string)($s['created_at'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "</div><hr>";
}

echo "</div>";

// ==============================
// 🆕 RPA STEPS
// ==============================
echo "<div class='section'>";
echo "<h2>RPA STEPS</h2>";

foreach ($rpaSteps as $s) {
  echo "<div>";
  echo "Scenario: " . htmlspecialchars((string)($s['scenario_id'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "Type: " . htmlspecialchars((string)($s['type'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "Selector: " . htmlspecialchars((string)($s['selector'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "Value: " . htmlspecialchars((string)($s['value'] ?? ''), ENT_QUOTES, 'UTF-8') . "<br>";
  echo "</div><hr>";
}

echo "</div>";

// ==============================
// INTEGRITY CHECK
// ==============================
echo "<div class='section'>";
echo "<h2>Integrity Check</h2>";

$form_ids = array_column($forms, 'id');

foreach ($answers as $a) {
  $fid = $a['form_id'] ?? null;

  if ($fid === null || !in_array($fid, $form_ids, true)) {
    echo "<div class='bad'>孤立answer検出: rowid="
      . htmlspecialchars((string)($a['rowid'] ?? ''), ENT_QUOTES, 'UTF-8')
      . " form_id="
      . htmlspecialchars((string)$fid, ENT_QUOTES, 'UTF-8')
      . "</div>";
  }
}

echo "<div class='good'>チェック完了</div>";
echo "</div>";