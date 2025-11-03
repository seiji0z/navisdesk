<?php
// Tell browser we send JSON
header("Content-Type: application/json");

// Connect to MongoDB
$mongo = new MongoDB\Driver\Manager("mongodb://localhost:27017");

// Get all admins
$command1 = new MongoDB\Driver\Command([
    "find" => "admin_osas"
]);
$cursor1 = $mongo->executeCommand("navisdesk_db", $command1);
$admins = $cursor1->toArray();

// Get all student organizations
$command2 = new MongoDB\Driver\Command([
    "find" => "student_organizations"
]);
$cursor2 = $mongo->executeCommand("navisdesk_db", $command2);
$orgs = $cursor2->toArray();

// Make empty list for users
$all_users = array();

// Add admins to list
foreach ($admins as $a) {
    $user = array(
        "name" => $a->name,
        "email" => $a->email,
        "role" => ($a->role == "admin") ? "Admin" : "OSAS Officer",
        "status" => $a->status ?? "Active",
        "dateRegistered" => date("d/m/Y", $a->created_at->toDateTime()->getTimestamp()),
        "lastLogin" => $a->last_log ? date("d/m/Y", $a->last_log->toDateTime()->getTimestamp()) : "N/A"
    );
    array_push($all_users, $user);
}

// Add organizations to list
foreach ($orgs as $o) {
    $user = array(
        "name" => $o->name,
        "email" => $o->email,
        "role" => "Student Org",
        "status" => $o->status ?? "Active",
        "dateRegistered" => date("d/m/Y", $o->created_at->toDateTime()->getTimestamp()),
        "lastLogin" => $o->last_log ? date("d/m/Y", $o->last_log->toDateTime()->getTimestamp()) : "N/A",
        "abbreviation" => $o->abbreviation ?? "",
        "department" => $o->department ?? "",
        "type" => $o->type ?? "",
        "adviserName" => $o->adviser->name ?? "",
        "adviserEmail" => $o->adviser->email ?? "",
        "description" => $o->description ?? "",
        "fb" => $o->fb_link ?? "",
        "ig" => $o->ig_link ?? "",
        "website" => $o->website_link ?? ""
    );
    array_push($all_users, $user);
}

// Send data to JavaScript
echo json_encode($all_users);
?>