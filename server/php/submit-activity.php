<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

// Get org ID from header
$orgId = $_SERVER['HTTP_X_ORG_ID'] ?? null;
if (!$orgId) {
    http_response_code(401);
    echo json_encode(['error' => 'Organization ID required']);
    exit;
}

// Read raw POST data (multipart/form-data)
$files = $_FILES;
$fields = $_POST;

// Build activity object
$activity = [
    'org_id' => new MongoDB\BSON\ObjectId($orgId),
    'title' => $fields['title'] ?? '',
    'description' => $fields['description'] ?? '',
    'objectives' => $fields['objectives'] ?? '',
    'type' => $fields['type'] ?? 'General',
    'date_start' => $fields['date_start'] ?? '',
    'date_end' => $fields['date_end'] ?? '',
    'venue' => $fields['venue'] ?? '',
    'acad_year' => $fields['acad_year'] ?? '2025-2026',
    'term' => $fields['term'] ?? '1st Semester',
    'sdgs' => array_map('intval', $fields['sdgs'] ?? []),
    'status' => 'Pending',
    'submitted_at' => new MongoDB\BSON\UTCDateTime(),
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'supporting_docs' => [],
    'evidences' => []
];

// Handle file uploads
$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

foreach (['supporting_docs', 'evidences'] as $type) {
    if (!empty($files[$type]['name'][0])) {
        foreach ($files[$type]['name'] as $i => $name) {
            if ($files[$type]['error'][$i] === 0) {
                $ext = pathinfo($name, PATHINFO_EXTENSION);
                $filename = uniqid() . '.' . $ext;
                $path = $uploadDir . $filename;
                move_uploaded_file($files[$type]['tmp_name'][$i], $path);
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
    $result = insertOne('activities', $activity);
    echo json_encode(['success' => true, 'id' => (string)$result->getInsertedId()]);
} catch (Exception $e) {
    error_log("Submit Activity Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save activity']);
}
?>