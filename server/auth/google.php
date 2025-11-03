<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../../vendor/autoload.php';
$dbPath = 'C:/Users/Anjelo/Downloads/webtech/navisdesk/server/db.php';

if (!file_exists($dbPath)) {
    error_log("DB.PHP NOT FOUND! Path: $dbPath");
    http_response_code(500);
    echo json_encode(['error' => 'Server config error - db.php missing!']);
    exit;
}

require_once $dbPath;
require_once __DIR__ . '/../../vendor/autoload.php';

use Google\Client as GoogleClient;

// TEST DB NOW!
try {
    $db->listCollections();
    error_log("DB LOADED! findOne() READY! Path: $dbPath");
} catch (Exception $e) {
    error_log("DB CONNECT ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database down']);
    exit;
}

// TEST DB
try {
    $db->listCollections();
    error_log("DB CONNECTED! Ready for SSO.");
} catch (Exception $e) {
    error_log("DB Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'DB failed']);
    exit;
}

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
        'secure' => false,
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
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    echo json_encode(['role' => 'org']);
    exit;
}