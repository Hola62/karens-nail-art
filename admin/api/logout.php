<?php
// CORS for cross-origin frontend
$allowed_origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: $allowed_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Log activity
$admin_id = $_SESSION['admin_id'];
$ip = $_SERVER['REMOTE_ADDR'];
$stmt = $conn->prepare("INSERT INTO activity_log (admin_id, activity_type, description, ip_address) VALUES (?, 'logout', 'User logged out', ?)");
$stmt->bind_param("is", $admin_id, $ip);
$stmt->execute();

// Destroy session
session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);

$conn->close();
