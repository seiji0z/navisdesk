<?php
require_once __DIR__ . '/db.php';

$result = findAll('student_organizations');
echo "<pre>";
print_r($result);
echo "</pre>";
?>
