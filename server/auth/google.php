<?php
require_once __DIR__ . '/../db.php';
use Google\Client as GoogleClient;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input      = json_decode(file_get_contents('php://input'), true);
$credential = $input['credential'] ?? '';
if (!$credential) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing credential']);
    exit;
}

/* ---------- 1. Verify token with Google ---------- */
try {
    $tokenUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($credential);
    $response = file_get_contents($tokenUrl);
    if ($response === false) throw new Exception(error_get_last()['message']);
    $payload  = json_decode($response, true);
    if (!$payload || !isset($payload['aud'])) throw new Exception('Invalid payload');
} catch (Exception $e) {
    error_log("Tokeninfo error: " . $e->getMessage());
    http_response_code(401);
    echo json_encode(['error' => 'Invalid Google token']);
    exit;
}

/* ---------- 2. LOG RAW GOOGLE EMAIL ---------- */
$googleEmail = $payload['email'] ?? '';
error_log("=== GOOGLE EMAIL ===");
error_log("Raw Google email: " . var_export($googleEmail, true));

/* ---------- 3. TRY EXACT MATCH FIRST ---------- */
$email = trim(strtolower($googleEmail));
error_log("Exact-match email for DB: $email");

$admin = $db->admin_osas->findOne(['email' => $email]);
$org   = $db->student_organizations->findOne(['email' => $email]);

error_log("Exact-match admin_osas: " . ($admin ? json_encode((array)$admin) : 'NULL'));
error_log("Exact-match student_organizations: " . ($org ? json_encode((array)$org) : 'NULL'));

if ($admin || $org) {
    $role = $admin ? ($admin->role === 'admin' ? 'admin' : 'osas') : 'org';
    setcookie('google_token', $credential, [
        'expires'   => time() + 3600,
        'path'      => '/',
        'secure'    => false,
        'httponly'  => true,
        'samesite'  => 'Lax'
    ]);
    echo json_encode(['role' => $role]);
    exit;
}

/* ---------- 4. FALLBACK: CASE-INSENSITIVE REGEX ---------- */
error_log("Exact match failed – trying case-insensitive regex");
$regex = new MongoDB\BSON\Regex('^' . preg_quote($email) . '$', 'i');

$admin = $db->admin_osas->findOne(['email' => $regex]);
$org   = $db->student_organizations->findOne(['email' => $regex]);

error_log("Regex admin_osas: " . ($admin ? json_encode((array)$admin) : 'NULL'));
error_log("Regex student_organizations: " . ($org ? json_encode((array)$org) : 'NULL'));

if ($admin || $org) {
    $role = $admin ? ($admin->role === 'admin' ? 'admin' : 'osas') : 'org';
    setcookie('google_token', $credential, [
        'expires'   => time() + 3600,
        'path'      => '/',
        'secure'    => false,
        'httponly'  => true,
        'samesite'  => 'Lax'
    ]);
    echo json_encode(['role' => $role]);
    exit;
}

/* ---------- 5. STILL NOT FOUND ---------- */
error_log("User NOT found for email: $email");
http_response_code(401);
echo json_encode(['error' => 'Unauthorized – user not found in DB']);
?>