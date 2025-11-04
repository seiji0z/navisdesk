<?php
require_once __DIR__ . '/../db.php';
use MongoDB\BSON\ObjectId;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: x-org-id, Authorization');

try {
    // -------------------------------------------------
    // 1. Get x-org-id header (optional)
    // -------------------------------------------------
    $orgIdHeader = $_SERVER['HTTP_X_ORG_ID'] ?? null;

    $filter = [];
    $options = ['sort' => ['created_at' => -1]];

    // -------------------------------------------------
    // 2. If header exists → filter by org (ORG USER)
    // -------------------------------------------------
    if ($orgIdHeader !== null) {
        // Validate format
        if (!preg_match('/^[a-f0-9]{24}$/i', $orgIdHeader)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid org_id format']);
            exit;
        }

        try {
            $orgObjectId = new ObjectId($orgIdHeader);
            $filter = ['org_id' => $orgObjectId];
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid org_id']);
            exit;
        }
    }
    // If NO header → OSAS/ADMIN → return ALL

    // -------------------------------------------------
    // 3. Query DB
    // -------------------------------------------------
    $activities = findAll('activities', $filter, $options);

    // -------------------------------------------------
    // 4. Format output
    // -------------------------------------------------
    $result = array_map(function ($doc) {
        $doc = (array)$doc;
        $doc['_id'] = (string)$doc['_id'];
        $doc['org_id'] = (string)$doc['org_id'];
        $doc['status'] = $doc['status'] ?? 'Pending';
        $doc['sdgs'] = $doc['sdgs'] ?? [];
        return $doc;
    }, $activities);

    echo json_encode(array_values($result));

} catch (Exception $e) {
    error_log('get-activities.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>