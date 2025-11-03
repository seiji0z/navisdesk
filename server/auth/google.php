<?php
require_once __DIR__ . '/../db.php';  // This loads autoload and MongoDB connection

use Google\Client as GoogleClient;

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

$client = new GoogleClient([
    'client_id' => '1083325548999-sm0paco4eo4tmn7d4hsdb0fbbltgaftr.apps.googleusercontent.com'
]);

try {
    $payload = $client->verifyIdToken($credential);
    if (!$payload) throw new Exception('Invalid token');
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid Google token']);
    exit;
}

$email = $payload['email'] ?? '';
if (!$email) {
    http_response_code(401);
    echo json_encode(['error' => 'No email']);
    exit;
}

error_log("SSO Email: $email");

$admin = findOne('admin_osas', ['email' => $email]);
if ($admin) {
    $role = $admin->role === 'admin' ? 'admin' : 'osas';
    setcookie('google_token', $credential, [
        'expires' => time() + 3600,
        'path' => '/',
        'secure' => false,  // Set to true in production (HTTPS)
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    echo json_encode(['role' => $role]);
    exit;
}

$org = findOne('student_organizations', ['email' => $email]);
if ($org) {
    setcookie('google_token', $credential, [
        'expires' => time() + 3600,
        'path' => '/',
        'secure' => false,  // Set to true in production (HTTPS)
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    echo json_encode(['role' => 'org']);
    exit;
}

http_response_code(401);
echo json_encode(['error' => 'Unauthorized']);
?>