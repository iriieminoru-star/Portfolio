<?php
// ================================
// デバッグ設定（本番はOff）
// ================================
ini_set('display_errors',1);
error_reporting(E_ALL);

// ================================
// レスポンス形式（JSON)
// ================================
header("Content-Type: application/json");

// ================================
// CORS設定（フロントからの通信許可）
// ================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ================================
// プリフライト（OPTIONS)対応
// ================================
if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// ================================
// DB接続ファイル読み込み
// ================================
require_once(__DIR__ . "/db.php");

// ================================
// JSONデータ受信
// ================================
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// JSON形式チェック
if(!is_array($data)) {
  echo json_encode([
    "status" => "error",
    "message" => "invalid json"
  ]);
  exit();
}

// ================================
// データ取得（未定義対策）
// ================================
$id = $data["id"] ?? null;
$title = $data["title"] ?? "";
$description = $data["description"] ?? "";
$fields = $data["fields"] ?? [];

// ================================
// 入力チェック
// ================================
if (trim($title) === "" || trim($description) === "") {
  echo json_encode([
    "status" => "error",
    "message" => "未入力があります"
  ]);
  exit();
}

try {
  // ================================
  // DB接続
  // ================================
  $pdo = getDB();

  // ================================
  // fieldsはJSON文字列に変換して保存
  // ================================
  $fieldsJson = json_encode($fields, JSON_UNESCAPED_UNICODE);

  if($fieldsJson === false) {
    throw new Exception("fieldsのJSON変換に失敗しました");
  }

  if($id){
    // ================================
    // update（既存データ更新）
    // ================================
    $stmt = $pdo->prepare("
    UPDATE forms
    SET title = :title,
        description = :description,
        fields = :fields
    WHERE id = :id
    ");

    $stmt->execute([
      ":id" => $id,
      ":title" => $title,
      ":description" => $description,
      ":fields" => $fieldsJson
    ]);

    } else {
      // ================================
      // INSERT(新規登録）
      // ================================
      $newId = uniqid();

      $stmt = $pdo->prepare("
        INSERT INTO forms (id, title, description, fields)
        VALUES (:id, :title, :description, :fields)
      ");

      $stmt->execute([
        ":id" => $newId,
        ":title" => $title,
        ":description" => $description,
        ":fields" => $fieldsJson
      ]);
    }

    // ================================
    // 正常レスポンス
    // ================================
    echo json_encode([
      "status" => "success",
      "id" => $id ? $id : $newId,
      "title" => $title,
      "description" => $description
    ]);

} catch (Exception $e) {
  // ================================
  // エラー処理
  // ================================
  echo json_encode([
    "status" => "error",
    "message" => $e->getMessage()
  ]);
}