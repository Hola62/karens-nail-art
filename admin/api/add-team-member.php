<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Only super admin can add users
if ($_SESSION['admin_role'] !== 'super_admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Only super admin can add team members']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $full_name = trim($data['full_name'] ?? '');
    $email = trim($data['email'] ?? '');
    $role = $data['role'] ?? 'admin';

    // Validate required fields
    if (empty($username) || empty($password) || empty($full_name) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }

    // Validate role
    if (!in_array($role, ['admin', 'editor'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid role']);
        exit;
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM admin_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
        exit;
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO admin_users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $hashed_password, $full_name, $email, $role);

    if ($stmt->execute()) {
        $new_user_id = $stmt->insert_id;

        // Log activity
        $admin_id = $_SESSION['admin_id'];
        $ip = $_SERVER['REMOTE_ADDR'];
        $log_stmt = $conn->prepare("INSERT INTO activity_log (admin_id, activity_type, description, ip_address) VALUES (?, 'user_add', ?, ?)");
        $description = "Added new team member: $full_name ($username) as $role";
        $log_stmt->bind_param("iss", $admin_id, $description, $ip);
        $log_stmt->execute();

        echo json_encode([
            'success' => true,
            'message' => 'Team member added successfully',
            'user_id' => $new_user_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add team member']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
