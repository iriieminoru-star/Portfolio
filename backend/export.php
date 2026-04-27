<?php

header("content-type: text/csv; charset=UTF-8");
header("Content-Disposition: attachment; filename=data.csv");

// BOM(Excelで文字化けしないようにするためのマジックコード)を出力
echo "\xEF\xBB\xBF";

$file = __DIR__ . "/data.json";

$list = [];

if (file_exists($file)) {
    $json = file_get_contents($file);
    $decoded = json_decode($json, true);

    if (is_array($decoded)) {
        $list = $decoded;
    }
}

// CSVのヘッダー行
echo "フォーム名,説明\n";

foreach ($list as $item) {
    // CSVの各行を出力
    $title = $item["title"] ?? "";
    $description = $item["description"] ?? "";
    
    // カンマ対策（ダブルクォートで囲む）
    echo '"' . $title . '","' . $description . '"' . "\r\n";
}