<?php
// Include DB helpers
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

//READ FILTERS FROM GET
$search     = trim($_GET['search'] ?? '');
$role       = trim($_GET['role'] ?? '');
$department = trim($_GET['department'] ?? '');
$status     = trim($_GET['status'] ?? '');


//MAP FRONTEND ROLE TO DB VALUE
$roleMap = [
    'admin'        => 'admin',
    'osas'         => 'osas',
    'Organization' => ['Organization', 'org']  // Accept both
];

$dbRoleFilter = null;
if ($role !== '') {
    $mapped = $roleMap[$role] ?? null;
    if (is_array($mapped)) {
        $dbRoleFilter = ['$in' => $mapped]; // Match any in array
    } else {
        $dbRoleFilter = $mapped;
    }
}


//BUILD MongoDB query
$filter = [];

if ($search !== '') {
    $regex = new MongoDB\BSON\Regex(preg_quote($search), 'i');
    $filter['$or'] = [
        ['name'  => $regex],
        ['email' => $regex],
    ];
}

if ($dbRoleFilter !== null) {
    $filter['role'] = $dbRoleFilter;
}

// Department filter (same field name in both collections)
if ($department !== '') {
    $filter['department'] = $department;
}

if ($status !== '') {
    $filter['status'] = $status;
}

// FETCH BOTH collections

try {
    // Get admins/OSAS and student orgs separately
    $admins = findAll('admin_osas', $filter);
    $orgs   = findAll('student_organizations', $filter);

    $all = []; // Combined list

    // Process Admins & OSAS
    foreach ($admins as $a) {
        $a = (array)$a;
        $dbRole = $a['role'] ?? '';

        // Convert DB role to user-friendly name
        $displayRole = match ($dbRole) {
            'admin' => 'Admin',
            'osas'  => 'OSAS Officer',
            'org'   => 'Student Org',
            default => 'Unknown'
        };

        $all[] = [
            "name"           => $a['name'] ?? '',
            "email"          => $a['email'] ?? '',
            "role"           => $displayRole,
            "status"         => $a['status'] ?? 'Active',
            "dateRegistered" => formatDate($a['created_at'] ?? null),
            "lastLogin"      => formatDate($a['last_log'] ?? null),
            "department"     => $a['department'] ?? '',
        ];
    }

    // Process Student Orgs
    foreach ($orgs as $o) {
        $o = (array)$o;
        $adviser = $o['adviser'] ?? [];

        $all[] = [
            "name"           => $o['name'] ?? '',
            "email"          => $o['email'] ?? '',
            "role"           => 'Student Org',
            "status"         => $o['status'] ?? 'Active',
            "dateRegistered" => formatDate($o['created_at'] ?? null),
            "lastLogin"      => formatDate($o['last_log'] ?? null),

            // Org-specific fields
            "abbreviation"   => $o['abbreviation'] ?? '',
            "department"     => $o['department'] ?? '',
            "type"           => $o['type'] ?? '',
            "adviserName"    => $adviser['name'] ?? '',
            "adviserEmail"   => $adviser['email'] ?? '',
            "description"    => $o['description'] ?? '',
            "fb"             => $o['fb_link'] ?? '',
            "ig"             => $o['ig_link'] ?? '',
            "website"        => $o['website_link'] ?? ''
        ];
    }

    // Send combined list
    echo json_encode(array_values($all));

} catch (Exception $e) {
    error_log("Users Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load users']);
}

//format MongoDB date to d/m/Y

function formatDate($date) {
    if (!$date) return "N/A";
    try {
        return (new DateTime($date))->format('d/m/Y');
    } catch (Exception $e) {
        return "N/A";
    }
}
?>