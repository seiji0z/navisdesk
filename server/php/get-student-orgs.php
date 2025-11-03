<?php
require_once __DIR__ . '/../db.php';  // ← FIXED PATH!
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

error_log("Get Student Orgs: Starting request");

if (!isset($_COOKIE['google_token'])) {
    error_log("Get Student Orgs: No auth token found");
    http_response_code(401);
    echo json_encode(['error' => 'Login required']);
    exit;
}

try {
    error_log("Get Student Orgs: Fetching from DB");
    $orgs = findAll('student_organizations');
    
    if (empty($orgs)) {
        error_log("Get Student Orgs: No organizations found in DB");
        echo json_encode([]);
        exit;
    }

    $result = array_map(function($org) {
        $org = (array)$org;
        $org['_id'] = (string)$org['_id'];
        return $org;
    }, $orgs);

    error_log("Get Student Orgs: Successfully found " . count($result) . " organizations");
    echo json_encode(array_values($result));
} catch (Exception $e) {
    error_log("ORGS 500: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'DB Error: ' . $e->getMessage()]);
}
?>