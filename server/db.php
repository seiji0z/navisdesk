<?php
// server/db.php

// CHANGE THESE TO MATCH YOUR XAMPP/WAMP/phpMyAdmin
$host = '127.0.0.1';
$port = '3306';           // Usually 3306
$db   = 'navi-desk';      // ← MUST EXIST in phpMyAdmin
$user = 'root';           // Default XAMPP/WAMP user
$pass = '';               // ← YOUR MySQL PASSWORD (empty if none)

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage()); // Log to PHP error log
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}

function findAll(string $table, array $where = []): array {
    global $pdo;
    $sql = "SELECT * FROM `$table`";
    $params = [];

    if ($where) {
        $conds = [];
        foreach ($where as $k => $v) {
            $conds[] = "`$k` = ?";
            $params[] = $v;
        }
        $sql .= " WHERE " . implode(' AND ', $conds);
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}
?>