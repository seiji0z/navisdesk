<?php
require_once __DIR__ . '/../db.php';
header('Content-Type: application/json');

//GET FILTER PARAMETERS FROM URL
$search     = trim($_GET['search'] ?? '');
$role       = trim($_GET['role'] ?? '');
$date_from  = trim($_GET['date_from'] ?? '');
$date_to    = trim($_GET['date_to'] ?? '');


//BUILD DATABASE FILTER
$filter = [];

// Search by user_name OR action (case-insensitive)
if ($search !== '') {
    $regex = new MongoDB\BSON\Regex(preg_quote($search), 'i');
    $filter['$or'] = [
        ['user_name' => $regex],
        ['action'    => $regex]
    ];
}

// Filter by role
if ($role !== '') {
    if ($role === 'Student Org') $filter['role'] = 'Organization';
    elseif ($role === 'OSAS Officer') $filter['role'] = 'OSAS Officer';
    elseif ($role === 'Admin') $filter['role'] = 'Admin';
}

// Filter by date range
if ($date_from !== '' || $date_to !== '') {
    $dateFilter = [];
    if ($date_from !== '') {
        $from = new DateTime($date_from . ' 00:00:00');
        $dateFilter['$gte'] = $from->format('Y-m-d H:i:s');
    }
    if ($date_to !== '') {
        $to = new DateTime($date_to . ' 23:59:59');
        $dateFilter['$lte'] = $to->format('Y-m-d H:i:s');
    }
    $filter['timestamp'] = $dateFilter;
}

 //FETCH LOGS FROM DB
try {
    $options = ['sort' => ['timestamp' => -1]]; // newest first
    $logs = findAll('user_logs', $filter, $options);

    // Format documents for frontend
    $formatted = array_map(function($log) {
        $log = (array)$log;
        return [
            '_id'       => (string)$log['_id'],
            'user_id'   => (string)$log['user_id'],
            'role'      => $log['role'] ?? 'Unknown',
            'action'    => $log['action'] ?? '',
            'timestamp' => $log['timestamp'] ?? '',
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
