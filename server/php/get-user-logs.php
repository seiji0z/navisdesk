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
    // Get logs, newest first
    $logs = findAll('user_logs', [], ['sort' => ['timestamp' => -1]]);

    // Format for frontend
    $formatted = array_map(function($log) {
        $log = (array)$log;
        return [
            '_id' => (string)$log['_id'],
            'user_id' => (string)$log['user_id'],
            'role' => $log['role'] ?? 'Unknown',
            'action' => $log['action'] ?? '',
            'timestamp' => $log['timestamp'] ?? ''
        ];
    }, $logs);

    echo json_encode(array_values($formatted));
} catch (Exception $e) {
    error_log("Logs Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load logs']);
}
?>