<?php

header("Access-Contorl-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
  "status" => "ok",
  "message" => "backend server running"
], JSON_UNESCAPED_UNICODE);