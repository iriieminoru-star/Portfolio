<?php

// ================================
// レスポンス形式をJSONに設定
// ================================
header("Content-Type: application/json");

// ================================
// CORS設定（フロントからのアクセス許可）
// ※開発用：本番ではオリジン制限すること
// ================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// ================================
// プリフライトリクエスト対応（OPTIONS）
// ブラウザが事前確認で送るリクエスト
// ================================
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ================================
// DB接続ファイル読み込み
// getDB()関数でSQLiteに接続
// ================================
require_once(__DIR__ . "/db.php");

// ================================
// JSONデータ受信
// ================================
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// JSONチェック
if (!is_array($data)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'invalid json'
    ]);
    exit();
}

// ================================
// ID取得
// ================================
$id = $data['id'] ?? '';

// からチェック（null + 空文字対策）
if (trim($id) === '') {
    echo json_encode([
        'status' => 'error',
        'message' => 'IDがありません'
    ]);
    exit();
}

try {
    // ================================
    // DB接続
    // ================================
    $pdo = getDB();

    // ================================
    // 削除対象が存在するかチェック
    // （存在しないIDを削除しても成功扱いになるのを防ぐ）
    // ================================
    // $stmt = $pdo->prepare("
    //     SELECT id FROM forms WHERE id = :id
    // ");
    // $stmt->execute([":id" => $id]);

    // $form = $stmt->fetch(PDO::FETCH_ASSOC);

    // if (!$form) {
    //     echo json_encode([
    //         'status' => 'error',
    //         'message' => '対象データが存在しません'
    //     ]);
    //     exit();
    // }

    // ================================
    // 削除処理
    // ================================
    $stmt = $pdo->prepare("
        DELETE FROM forms WHERE id = :id
    ");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("削除対象が見つかりませんでした");
    }

    // ================================
    // 正常レスポンス
    // ================================
    echo json_encode([
        'status' => 'success',
        'message' => '削除しました',
        'id' => $id
    ]);

} catch (Exception $e) {
    // ================================
    // エラー処理
    // ================================
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}