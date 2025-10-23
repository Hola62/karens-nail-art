<?php
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
?>
