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

// Handle contact form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $message = trim($data['message'] ?? '');

    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Name, email, and message are required']);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }

    // Get IP address
    $ip = $_SERVER['REMOTE_ADDR'];

    // Insert inquiry into database
    $stmt = $conn->prepare("INSERT INTO inquiries (name, email, phone, message, ip_address) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $phone, $message, $ip);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been received. We will get back to you soon.',
            'inquiry_id' => $stmt->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save inquiry']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
