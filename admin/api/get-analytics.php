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

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Get analytics data
$analytics = [
    'totalVisits' => [],
    'totalLikes' => [],
    'totalShares' => [],
    'totalInquiries' => [],
    'pageVisits' => [],
    'popularImages' => [],
    'recentInquiries' => []
];

// Get total visits
$result = $conn->query("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'visit'");
$analytics['totalVisits'] = $result->fetch_assoc()['count'];

// Get total likes
$result = $conn->query("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'like'");
$analytics['totalLikes'] = $result->fetch_assoc()['count'];

// Get total shares
$result = $conn->query("SELECT COUNT(*) as count FROM analytics WHERE event_type = 'share'");
$analytics['totalShares'] = $result->fetch_assoc()['count'];

// Get total inquiries
$result = $conn->query("SELECT COUNT(*) as count FROM inquiries");
$analytics['totalInquiries'] = $result->fetch_assoc()['count'];

// Get page visits breakdown
$result = $conn->query("SELECT page_name, COUNT(*) as count FROM analytics WHERE event_type = 'visit' AND page_name IS NOT NULL GROUP BY page_name ORDER BY count DESC");
while ($row = $result->fetch_assoc()) {
    $analytics['pageVisits'][$row['page_name']] = $row['count'];
}

// Get popular images (most liked)
$result = $conn->query("SELECT image_name, COUNT(*) as likes FROM analytics WHERE event_type = 'like' AND image_name IS NOT NULL GROUP BY image_name ORDER BY likes DESC LIMIT 10");
while ($row = $result->fetch_assoc()) {
    $analytics['popularImages'][] = $row;
}

// Get recent inquiries
$result = $conn->query("SELECT id, name, email, phone, message, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 10");
while ($row = $result->fetch_assoc()) {
    $analytics['recentInquiries'][] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $analytics
]);

$conn->close();
