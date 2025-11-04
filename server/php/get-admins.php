<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

try {
    // Fetch all admin users, only return the 'name' field
    $admins = findAll('admin_osas', [], ['projection' => ['name' => 1]]);

    // Convert to array and prepare for dropdowns
    $formatted = array_map(function($admin) {
        $admin = (array)$admin;
        return [
            '_id' => (string)$admin['_id'],           // Convert ObjectId to string
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
