<?php
require_once __DIR__ . '/../db.php';

header("Content-Type: application/json");

$mongo = new MongoDB\Driver\Manager("mongodb://localhost:27017");

$command = new MongoDB\Driver\Command([
    'find' => 'student_organizations',
    'projection' => ['_id' => 1, 'department' => 1]
]);

try {
    $cursor = $mongo->executeCommand('navisdesk_db', $command);
    $docs = $cursor->toArray();

    $result = array_map(function($doc) {
        return [
            '_id' => ['$oid' => (string)$doc->_id],
            'department' => $doc->department ?? 'N/A'
        ];
    }, $docs);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB Error']);
}
?>