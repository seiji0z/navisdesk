<?php
// Include the database helper functions
require_once __DIR__ . '/../db.php';  

// Tell browser to expect JSON response
header('Content-Type: application/json');

try {
    // Fetch all activities, sorted by 'created_at' descending
    $activities = findAll('activities', [], ['sort' => ['created_at' => -1]]);

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
        return $doc;
    }, $activities);

    // Return JSON array
    echo json_encode(array_values($result));

} catch (Exception $e) {
    // Log error on server
    error_log("Activities Error: " . $e->getMessage());

    // Return 500 Internal Server Error
    http_response_code(500);
    echo json_encode(['error' => 'DB Error']);
}
?>
