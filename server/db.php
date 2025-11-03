<?php
header('Content-Type: application/json');

function getMongo() {
    static $mongo = null;
    if ($mongo === null) {
        $mongo = new MongoDB\Driver\Manager('mongodb://localhost:27017');
    }
    return $mongo;
}

function findAll(string $collection, array $filter = [], array $options = []): array {
    $cmd = ['find' => $collection];
    if (!empty($filter))  $cmd['filter']  = $filter;
    if (!empty($options)) $cmd = array_merge($cmd, $options);

    $cursor = getMongo()->executeCommand('navisdesk_db', new MongoDB\Driver\Command($cmd));
    return $cursor->toArray();
}
?>