<?php
// Database Configuration TEMPLATE
// INSTRUCTIONS:
// 1. Copy this file and rename it to: config.php
// 2. Replace the placeholder values with your actual database credentials
// 3. DO NOT commit config.php to GitHub (it's in .gitignore)

define('DB_HOST', 'localhost');
define('DB_USERNAME', 'your_username');
define('DB_PASSWORD', 'your_password');
define('DB_NAME', 'your_database_name');

// Security settings
define('SESSION_LIFETIME', 3600); // 1 hour in seconds
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 900); // 15 minutes in seconds
