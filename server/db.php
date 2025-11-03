<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

$mongoUri = 'mongodb://localhost:27017/';
$dbName   = 'navisdesk_db';

try {
    $client = new Client($mongoUri);
    $db = $client->selectDatabase($dbName);
    error_log("Connected to local MongoDB at $mongoUri");
} catch (Exception $e) {
    error_log("MongoDB Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// --- Helper Functions ---

function findOne(string $collection, array $filter = []): ?object {
    global $db;
    return $db->$collection->findOne($filter);
}

function findAll(string $collection, array $filter = []): array {
    global $db;
    $cursor = $db->$collection->find($filter);
    return iterator_to_array($cursor);
}
?>
