<?php
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

$mongo = new MongoDB\Driver\Manager("mongodb://localhost:27017");

$command = new MongoDB\Driver\Command([
    'aggregate' => 'user_logs',
    'pipeline' => [
        ['$sort' => ['timestamp' => -1]]
    ],
    'cursor' => new stdClass
]);

$cursor = $mongo->executeCommand('navisdesk_db', $command);
$logs = current($cursor->toArray())->result ?? [];

$formatted = array_map(function($log) {
    return [
        '_id' => (string)$log->_id,
        'user_id' => (string)$log->user_id,
        'role' => $log->role ?? "Unknown",
        'action' => $log->action ?? "",
        'timestamp' => $log->timestamp?->toDateTime()->format('c') ?? ""
    ];
}, $logs);

echo json_encode($formatted);
?>