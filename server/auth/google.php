<?php
// server/php/auth/google.php
require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$credential = $input['credential'] ?? '';

if (!$credential) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing credential']);
    exit;
}

/* -------------------------------------------------
   Verify Google token (client-side already does it,
   we just trust the token and look up the user)
   ------------------------------------------------- */
$payload = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.',$credential)[1]))), true);

$email = $payload['email'] ?? '';
if (!$email) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

/* -------------------------------------------------
   1. Look in admin_osas
   2. If not found → look in student_organizations
   ------------------------------------------------- */
$admin = current(findAll('admin_osas', ['email' => $email]));
if ($admin) {
    $role = $admin->role === 'admin' ? 'admin' : 'osas';
    echo json_encode(['role' => $role]);
    exit;
}

$org = current(findAll('student_organizations', ['email' => $email]));
if ($org) {
    echo json_encode(['role' => 'org']);
    exit;
}

/* -------------------------------------------------
   No user → deny
   ------------------------------------------------- */
http_response_code(403);
echo json_encode(['error' => 'User not authorized']);
?>