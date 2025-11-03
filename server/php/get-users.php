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
    // Get admins & orgs
    $admins = findAll('admin_osas');
    $orgs = findAll('student_organizations');

    $all_users = [];

    // Format Admins
    foreach ($admins as $a) {
        $a = (array)$a;
        $all_users[] = [
            "name" => $a['name'] ?? '',
            "email" => $a['email'] ?? '',
            "role" => ($a['role'] ?? '') === 'admin' ? 'Admin' : 'OSAS Officer',
            "status" => $a['status'] ?? 'Active',
            "dateRegistered" => formatDate($a['created_at'] ?? null),
            "lastLogin" => formatDate($a['last_log'] ?? null),
        ];
    }

    // Format Orgs
    foreach ($orgs as $o) {
        $o = (array)$o;
        $adviser = $o['adviser'] ?? [];
        $all_users[] = [
            "name" => $o['name'] ?? '',
            "email" => $o['email'] ?? '',
            "role" => 'Student Org',
            "status" => $o['status'] ?? 'Active',
            "dateRegistered" => formatDate($o['created_at'] ?? null),
            "lastLogin" => formatDate($o['last_log'] ?? null),
            "abbreviation" => $o['abbreviation'] ?? '',
            "department" => $o['department'] ?? '',
            "type" => $o['type'] ?? '',
            "adviserName" => $adviser['name'] ?? '',
            "adviserEmail" => $adviser['email'] ?? '',
            "description" => $o['description'] ?? '',
            "fb" => $o['fb_link'] ?? '',
            "ig" => $o['ig_link'] ?? '',
            "website" => $o['website_link'] ?? ''
        ];
    }

    echo json_encode(array_values($all_users));
} catch (Exception $e) {
    error_log("Users Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load users']);
}

// Helper: Format MongoDB Date
function formatDate($date) {
    if (!$date) return "N/A";
    try {
        return (new DateTime($date))->format('d/m/Y');
    } catch (Exception $e) {
        return "N/A";
    }
}
?>