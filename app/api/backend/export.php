<?php

// CORS対応
header("Access-Control-Allow-Origin: *");

// CSVダウンロードヘッダー
header("content-type: text/csv; charset=UTF-8");
header("Content-Disposition: attachment; filename=data.csv");

// BOM(Excelで文字化けしないようにするためのマジックコード)を出力
echo "\xEF\xBB\xBF";

$jsonFile = __DIR__ . "/data.json";

if (!file_exists($jsonFile)) {
    echo "データファイルが見つかりません。";
    exit();
}

$jsonData = file_get_contents($jsonFile);
$data = json_decode($jsonData, true);

if (!$data || count($data) === 0 ) {

}

// CSV出力開始
$output = fopen('php://output', 'w');

// ヘッダー行（キーを取得）
$headers = array_keys($data[0]);
fputcsv($output, $headers);

foreach ($data as $row) {
    // CSVの各行を出力
    fputcsv($output, $row);
}

fclose($output);
exit;
