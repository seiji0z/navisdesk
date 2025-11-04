<?php
require_once __DIR__ . '/../db.php';
use MongoDB\BSON\ObjectId;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: x-org-id');

try {
    // -------------------------------------------------
    // 1. Get the org ID from header
    // -------------------------------------------------
    $orgIdHeader = $_SERVER['HTTP_X_ORG_ID'] ?? null;

<<<<<<< HEAD
    if (!$orgIdHeader) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing x-org-id header']);
        exit;
    }

    // -------------------------------------------------
    // 2. Validate & convert to ObjectId using try/catch
    // -------------------------------------------------
    try {
        $orgObjectId = new ObjectId($orgIdHeader);
    } catch (\Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid org_id format']);
        exit;
    }

    // -------------------------------------------------
    // 3. Query activities for THIS org only
    // -------------------------------------------------
    $filter  = ['org_id' => $orgObjectId];
    $options = ['sort' => ['created_at' => -1]];

    $activities = findAll('activities', $filter, $options);

    // -------------------------------------------------
    // 4. Format for frontend
    // -------------------------------------------------
    $result = array_map(function ($doc) {
        $doc = (array)$doc;
        $doc['_id']    = (string)$doc['_id'];
        $doc['org_id'] = (string)$doc['org_id'];
        $doc['status'] = $doc['status'] ?? 'Pending';
        $doc['sdgs']   = $doc['sdgs']   ?? [];
=======
    // Convert MongoDB documents to arrays and format fields for frontend
    $result = array_map(function($doc) {
        $doc = (array)$doc;                     // Convert BSON document to PHP array
        $doc['_id'] = (string)$doc['_id'];     // Convert ObjectId to string
        $doc['org_id'] = (string)$doc['org_id'];
        
        // Convert ObjectIds to strings for submitted_by and reviewed_by if they exist
        if (isset($doc['submitted_by']) && is_object($doc['submitted_by'])) {
            $doc['submitted_by'] = (string)$doc['submitted_by'];
        }
        if (isset($doc['reviewed_by']) && is_object($doc['reviewed_by'])) {
            $doc['reviewed_by'] = (string)$doc['reviewed_by'];
        }
        
        $doc['status'] = $doc['status'] ?? 'Pending'; // Default status
        $doc['sdgs'] = $doc['sdgs'] ?? [];     // Default empty SDGs array
>>>>>>> 5237f983807e629bf5b157fecd18f2ea51e32fe0
        return $doc;
    }, $activities);

    echo json_encode(array_values($result));

} catch (Exception $e) {
    error_log('get-activities.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>