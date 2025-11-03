<?php
header("Content-Type: application/json");

$mongo = new MongoDB\Driver\Manager("mongodb://localhost:27017");

$command = new MongoDB\Driver\Command([
    'find' => 'admin_osas',
    'projection' => ['_id' => 1, 'name' => 1]
]);

$cursor = $mongo->executeCommand('navisdesk_db', $command);
$admins = $cursor->toArray();

$formatted = array_map(function($admin) {
    return ['_id' => (string)$admin->_id, 'name' => $admin->name ?? "Unknown Admin"];
}, $admins);

echo json_encode($formatted);
?>