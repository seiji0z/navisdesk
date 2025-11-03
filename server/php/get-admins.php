<?php
require_once __DIR__ . '/../db.php';  // ← Atlas + findAll()!
header('Content-Type: application/json');

// SECURE: Only Admins!
// if (!isset($_COOKIE['google_token'])) {
//     http_response_code(401);
//     echo json_encode(['error' => 'Login required']);
//     exit;
// }

try {
    // Get admins with only _id and name
    $admins = findAll('admin_osas', [], ['projection' => ['name' => 1]]);

    // Format for dropdown
    $formatted = array_map(function($admin) {
        $admin = (array)$admin;
        return [
            '_id' => (string)$admin['_id'],
            'name' => $admin['name'] ?? 'Unknown Admin'
        ];
    }, $admins);

    echo json_encode(array_values($formatted));
} catch (Exception $e) {
    error_log("Admins Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load admins']);
}
?>