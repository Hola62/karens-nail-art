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

// Handle image upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_FILES['images']) || !isset($_POST['gallery_type'])) {
        echo json_encode(['success' => false, 'message' => 'No files or gallery type provided']);
        exit;
    }

    $gallery_type = $_POST['gallery_type'];
    $admin_id = $_SESSION['admin_id'];
    $upload_dir = __DIR__ . '/../../assets/images/';

    // Create directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $uploaded_files = [];
    $errors = [];

    $files = $_FILES['images'];
    $file_count = count($files['name']);

    for ($i = 0; $i < $file_count; $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $tmp_name = $files['tmp_name'][$i];
            $original_name = basename($files['name'][$i]);
            $file_size = $files['size'][$i];

            // Validate file type
            $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            $file_type = mime_content_type($tmp_name);

            if (!in_array($file_type, $allowed_types)) {
                $errors[] = "$original_name: Invalid file type";
                continue;
            }

            // Validate file size (5MB max)
            if ($file_size > 5 * 1024 * 1024) {
                $errors[] = "$original_name: File too large (max 5MB)";
                continue;
            }

            // Generate unique filename
            $extension = pathinfo($original_name, PATHINFO_EXTENSION);
            $new_filename = uniqid() . '_' . time() . '.' . $extension;
            $destination = $upload_dir . $new_filename;

            // Move uploaded file
            if (move_uploaded_file($tmp_name, $destination)) {
                // Insert into database
                $stmt = $conn->prepare("INSERT INTO gallery_images (gallery_type, filename, original_name, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("sssii", $gallery_type, $new_filename, $original_name, $file_size, $admin_id);

                if ($stmt->execute()) {
                    $uploaded_files[] = [
                        'id' => $stmt->insert_id,
                        'filename' => $new_filename,
                        'original_name' => $original_name,
                        'url' => '../assets/images/' . $new_filename
                    ];

                    // Log activity
                    $log_stmt = $conn->prepare("INSERT INTO activity_log (admin_id, activity_type, description, ip_address) VALUES (?, 'upload', ?, ?)");
                    $description = "Uploaded image: $original_name to $gallery_type gallery";
                    $ip = $_SERVER['REMOTE_ADDR'];
                    $log_stmt->bind_param("iss", $admin_id, $description, $ip);
                    $log_stmt->execute();
                } else {
                    unlink($destination);
                    $errors[] = "$original_name: Database error";
                }

                $stmt->close();
            } else {
                $errors[] = "$original_name: Failed to move file";
            }
        } else {
            $errors[] = "File $i: Upload error " . $files['error'][$i];
        }
    }

    echo json_encode([
        'success' => count($uploaded_files) > 0,
        'message' => count($uploaded_files) . ' file(s) uploaded successfully',
        'files' => $uploaded_files,
        'errors' => $errors
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
