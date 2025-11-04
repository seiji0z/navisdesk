<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

/* -------------------------------------------------
   1. READ FILTERS FROM GET
   ------------------------------------------------- */
$search     = trim($_GET['search'] ?? '');
$role       = trim($_GET['role'] ?? '');
$date_from  = trim($_GET['date_from'] ?? '');
$date_to    = trim($_GET['date_to'] ?? '');

/* -------------------------------------------------
   2. BUILD MongoDB FILTER
   ------------------------------------------------- */
$filter = [];

// --- Search: match user_name OR action (case-insensitive) ---
if ($search !== '') {
    $regex = new MongoDB\BSON\Regex(preg_quote($search), 'i');
    $filter['$or'] = [
        ['user_name' => $regex],
        ['action'    => $regex]
    ];
}

// --- Role filter: map frontend → DB value ---
if ($role !== '') {
    if ($role === 'Student Org') {
        $filter['role'] = 'Organization';  // DB uses "Organization"
    } elseif ($role === 'OSAS Officer') {
        $filter['role'] = 'OSAS Officer';
    } elseif ($role === 'Admin') {
        $filter['role'] = 'Admin';
    }
    // If empty → no filter
}

// --- Date range filter ---
if ($date_from !== '' || $date_to !== '') {
    $dateFilter = [];

    if ($date_from !== '') {
        // Start of day: 00:00:00
        $from = new DateTime($date_from . ' 00:00:00');
        $dateFilter['$gte'] = $from->format('Y-m-d H:i:s');
    }

    if ($date_to !== '') {
        // End of day: 23:59:59
        $to = new DateTime($date_to . ' 23:59:59');
        $dateFilter['$lte'] = $to->format('Y-m-d H:i:s');
    }

    $filter['timestamp'] = $dateFilter;
}

/* -------------------------------------------------
   3. FETCH FROM DB (sorted by timestamp DESC)
   ------------------------------------------------- */
try {
    $options = ['sort' => ['timestamp' => -1]];
    $logs = findAll('user_logs', $filter, $options);

    // Format for frontend
    $formatted = array_map(function($log) {
        $log = (array)$log;
        return [
            '_id'       => (string)$log['_id'],
            'user_id'   => (string)$log['user_id'],
            'role'      => $log['role'] ?? 'Unknown',
            'action'    => $log['action'] ?? '',
            'timestamp' => $log['timestamp'] ?? '',
            // Optional: include user_name if you want to avoid name lookup
            'user_name' => $log['user_name'] ?? ''
        ];
    }, $logs);

    echo json_encode(array_values($formatted));

} catch (Exception $e) {
    error_log("User Logs Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load logs']);
}
?>