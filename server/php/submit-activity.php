<?php
// Include DB functions
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

// Get organization ID from custom HTTP header (sent by frontend)
$orgId = $_SERVER['HTTP_X_ORG_ID'] ?? null;
if (!$orgId) {
    http_response_code(401);
    echo json_encode(['error' => 'Organization ID required']);
    exit;
}

// Get uploaded files and form fields
$files = $_FILES;  // Contains uploaded files
$fields = $_POST;  // Contains text inputs

// Build the activity data to save in MongoDB
$activity = [
    'org_id' => new MongoDB\BSON\ObjectId($orgId), // Convert string ID to ObjectId
    'title' => $fields['title'] ?? '',
    'description' => $fields['description'] ?? '',
    'objectives' => $fields['objectives'] ?? '',
    'type' => $fields['type'] ?? 'General',
    'date_start' => $fields['date_start'] ?? '',
    'date_end' => $fields['date_end'] ?? '',
    'venue' => $fields['venue'] ?? '',
    'acad_year' => $fields['acad_year'] ?? '2025-2026',
    'term' => $fields['term'] ?? '1st Semester',
    'sdgs' => array_map('intval', $fields['sdgs'] ?? []), // Convert SDGs to integers
    'status' => 'Pending',
    'submitted_at' => new MongoDB\BSON\UTCDateTime(), // Current time in UTC
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'supporting_docs' => [],
    'evidences' => []
];

// Create uploads folder if it doesn't exist
$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true); // 0755 = permissions

// Handle file uploads for supporting_docs and evidences
foreach (['supporting_docs', 'evidences'] as $type) {
    if (!empty($files[$type]['name'][0])) { // Check if files were uploaded
        foreach ($files[$type]['name'] as $i => $name) {
            if ($files[$type]['error'][$i] === 0) { // No upload error
                $ext = pathinfo($name, PATHINFO_EXTENSION); // Get file extension
                $filename = uniqid() . '.' . $ext;           // Unique filename
                $path = $uploadDir . $filename;

                // Move file from temp location to final folder
                move_uploaded_file($files[$type]['tmp_name'][$i], $path);

                // Save file info in activity
                $activity[$type][] = [
                    'file_name' => $filename,
                    'original_name' => $name,
                    'upload_date' => new MongoDB\BSON\UTCDateTime()
                ];
            }
        }
    }
}

try {
    // Insert the new activity into MongoDB
    $result = insertOne('activities', $activity);
    // Return success + new activity ID
    echo json_encode(['success' => true, 'id' => (string)$result->getInsertedId()]);
} catch (Exception $e) {
    error_log("Submit Activity Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save activity']);
}
?>