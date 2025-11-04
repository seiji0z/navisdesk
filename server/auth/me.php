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
    // Use the role directly from the database
    $role = $admin->role;

    // Build response including available name fields from token and DB
    $resp = [
        'loggedIn' => true,
        'role' => $role,
        'email' => $email,
    ];

    // Prefer DB-stored names if available
    if (isset($admin->first_name)) $resp['first_name'] = $admin->first_name;
    if (isset($admin->last_name)) $resp['last_name'] = $admin->last_name;
    if (isset($admin->full_name)) $resp['full_name'] = $admin->full_name;

    // Include Google token payload names as fallback
    if (isset($payload['given_name'])) $resp['given_name'] = $payload['given_name'];
    if (isset($payload['family_name'])) $resp['family_name'] = $payload['family_name'];
    if (isset($payload['name'])) $resp['name'] = $payload['name'];

    echo json_encode($resp);
    exit;
}

$org = findOne('student_organizations', ['email' => $email]);
if ($org) {
    $resp = [
        'loggedIn' => true,
        'role' => 'org',
        'email' => $email,
    ];

    if (isset($org->first_name)) $resp['first_name'] = $org->first_name;
    if (isset($org->last_name)) $resp['last_name'] = $org->last_name;
    if (isset($org->full_name)) $resp['full_name'] = $org->full_name;

    if (isset($payload['given_name'])) $resp['given_name'] = $payload['given_name'];
    if (isset($payload['family_name'])) $resp['family_name'] = $payload['family_name'];
    if (isset($payload['name'])) $resp['name'] = $payload['name'];

    echo json_encode($resp);
    exit;
}

http_response_code(401);
echo json_encode(['loggedIn' => false]);
?>