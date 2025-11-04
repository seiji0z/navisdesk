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
