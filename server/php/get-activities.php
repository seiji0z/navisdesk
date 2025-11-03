<?php
require_once __DIR__ . '/../db.php';  // ← FIXED: UP ONE TO server/db.php!
header('Content-Type: application/json');

if (!isset($_COOKIE['google_token'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
}

try {
    $activities = findAll('activities', [], ['sort' => ['created_at' => -1]]);
    $result = array_map(function($doc) {
        $doc = (array)$doc;
        $doc['_id'] = (string)$doc['_id'];
        $doc['org_id'] = (string)$doc['org_id'];
        $doc['status'] = $doc['status'] ?? 'Pending';
        $doc['sdgs'] = $doc['sdgs'] ?? [];
        return $doc;
    }, $activities);

    echo json_encode(array_values($result));
} catch (Exception $e) {
    error_log("Activities Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'DB Error']);
}
?>