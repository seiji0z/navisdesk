<?php
require_once __DIR__ . '/../db.php';

use Google\Client as GoogleClient;

$token = $_COOKIE['google_token'] ?? '';
if (!$token) {
    http_response_code(401);
    echo json_encode(['loggedIn' => false]);
    exit;
}

$client = new GoogleClient([
    'client_id' => '1083325548999-sm0paco4eo4tmn7d4hsdb0fbbltgaftr.apps.googleusercontent.com'
]);
try {
    $payload = $client->verifyIdToken($token);
    if (!$payload) throw new Exception('Invalid token');
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['loggedIn' => false]);
    exit;
}

$email = $payload['email'] ?? '';
if (!$email) {
    http_response_code(401);
    echo json_encode(['loggedIn' => false]);
    exit;
}

$admin = findOne('admin_osas', ['email' => $email]);
if ($admin) {
    $role = $admin->role === 'admin' ? 'admin' : 'osas';
    echo json_encode(['loggedIn' => true, 'role' => $role, 'email' => $email]);
    exit;
}

$org = findOne('student_organizations', ['email' => $email]);
if ($org) {
    echo json_encode(['loggedIn' => true, 'role' => 'org', 'email' => $email]);
    exit;
}

http_response_code(401);
echo json_encode(['loggedIn' => false]);
?>