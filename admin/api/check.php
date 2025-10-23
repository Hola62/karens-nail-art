<?php
// Simple check endpoint to detect if backend is available
header('Content-Type: application/json');
echo json_encode(['status' => 'ok', 'backend' => 'available']);
