<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

/* -------------------------------------------------
   1. READ FILTERS FROM GET
   ------------------------------------------------- */
$search     = trim($_GET['search'] ?? '');
$role       = trim($_GET['role'] ?? '');
$department = trim($_GET['department'] ?? '');
$status     = trim($_GET['status'] ?? '');

/* -------------------------------------------------
   2. MAP FRONTEND ROLE TO DB VALUE
   ------------------------------------------------- */
$roleMap = [
    'admin'        => 'admin',
    'osas'         => 'osas',
    'Organization' => ['Organization', 'org']  // Accept both
];

$dbRoleFilter = null;
if ($role !== '') {
    $mapped = $roleMap[$role] ?? null;
    if (is_array($mapped)) {
        $dbRoleFilter = ['$in' => $mapped];
    } else {
        $dbRoleFilter = $mapped;
    }
}

/* -------------------------------------------------
   3. BUILD MongoDB query
   ------------------------------------------------- */
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

/* ---- NEW: Department filter ---- */
if ($department !== '') {
    // For admin/osas the field is called "department"
    // For orgs it is also "department"
    $filter['department'] = $department;
}

if ($status !== '') {
    $filter['status'] = $status;
}

/* -------------------------------------------------
   4. FETCH BOTH collections
   ------------------------------------------------- */
try {
    $admins = findAll('admin_osas', $filter);
    $orgs   = findAll('student_organizations', $filter);

    $all = [];

    // ---------- Admins & OSAS ----------
    foreach ($admins as $a) {
        $a = (array)$a;
        $dbRole = $a['role'] ?? '';

        // Map DB role → Display role
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

            // Keep department for the front-end (used in edit modal)
            "department"     => $a['department'] ?? '',
        ];
    }

    // ---------- Student Orgs ----------
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

            // Org-only fields
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

    // Return ONLY the fields the front-end expects
    echo json_encode(array_values($all));

} catch (Exception $e) {
    error_log("Users Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load users']);
}

/* -------------------------------------------------
   Helper: format MongoDB date → d/m/Y
   ------------------------------------------------- */
function formatDate($date) {
    if (!$date) return "N/A";
    try {
        return (new DateTime($date))->format('d/m/Y');
    } catch (Exception $e) {
        return "N/A";
    }
}
?>