<?php
// server/php/auth/me.php
require_once __DIR__ . '/../db.php';

$token = $_COOKIE['google_token'] ?? '';
if (!$token) {
    http_response_code(401);
    echo json_encode(['loggedIn' => false]);
    exit;
}

/* -------------------------------------------------
   Decode payload (same as in google.php)
   ------------------------------------------------- */
$payload = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.',$token)[1]))), true);
$email = $payload['email'] ?? '';

if (!$email) {
    http_response_code(401);
    echo json_encode(['loggedIn' => false]);
    exit;
}

/* -------------------------------------------------
   Find user – same logic as google.php
   ------------------------------------------------- */
$admin = current(findAll('admin_osas', ['email' => $email]));
if ($admin) {
    $role = $admin->role === 'admin' ? 'admin' : 'osas';
    echo json_encode(['loggedIn' => true, 'role' => $role, 'email' => $email]);
    exit;
}

$org = current(findAll('student_organizations', ['email' => $email]));
if ($org) {
    echo json_encode(['loggedIn' => true, 'role' => 'org', 'email' => $email]);
    exit;
}

http_response_code(401);
echo json_encode(['loggedIn' => false]);
?>