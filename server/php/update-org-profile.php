<?php
// Include DB functions
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

// Get org ID from header (sent by frontend)
$orgId = $_SERVER['HTTP_X_ORG_ID'] ?? null;
if (!$orgId) {
    http_response_code(401);
    echo json_encode(['error' => 'Org ID required']);
    exit;
}

// Read raw JSON from request body (not form data)
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400); // Bad request
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

try {
    // Check if the organization exists
    $org = findOne('student_orgs', ['_id' => new MongoDB\BSON\ObjectId($orgId)]);
    if (!$org) {
        http_response_code(404);
        echo json_encode(['error' => 'Org not found']);
        exit;
    }

    // Save updated info in 'temporary_details' for admin review
    $update = ['$set' => ['temporary_details' => $data]];
    updateOne('student_orgs', ['_id' => new MongoDB\BSON\ObjectId($orgId)], $update);

    // Confirm submission
    echo json_encode(['success' => true, 'message' => 'Update submitted for review']);

} catch (Exception $e) {
    error_log("Update Org Profile Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Update failed']);
}
?>