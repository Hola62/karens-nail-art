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

// Track analytics event
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $event_type = $data['event_type'] ?? ''; // visit, like, share
    $page_name = $data['page_name'] ?? null;
    $image_name = $data['image_name'] ?? null;
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

    if (empty($event_type) || !in_array($event_type, ['visit', 'like', 'share'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid event type']);
        exit;
    }

    // Insert analytics event
    $stmt = $conn->prepare("INSERT INTO analytics (event_type, page_name, image_name, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $event_type, $page_name, $image_name, $ip, $user_agent);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Event tracked']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to track event']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
