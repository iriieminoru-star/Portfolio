<?

require_once(__DIR__ . "/../db.php");

header("Contenet-Type: application/json; charset=utf-8");

try {
  $stmt = $pdo->query("
  SELECT *
  FROM answers
  ORDER BY rowid DESC
  ");

  $snswers = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "status" => "success",
    "answers" => $answers
  ]);

} catch (Exception $e) {
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}