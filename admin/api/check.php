<?php
// CORS for cross-origin frontend (GitHub Pages)
$allowed_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
// You can restrict to your domain: e.g., 'https://hola62.github.io'
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Simple check endpoint to detect if backend is available
header('Content-Type: application/json');
echo json_encode(['status' => 'ok', 'backend' => 'available']);
