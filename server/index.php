<?php
// server/index.php

$request = $_SERVER['REQUEST_URI'];
$root = __DIR__ . '/..';  // navisdesk/ folder

// 1. Serve login.html at root
if ($request === '/' || $request === '') {
    $file = $root . '/login.html';
    if (file_exists($file)) {
        readfile($file);
        exit;
    }
    http_response_code(404);
    echo 'Login page not found';
    exit;
}

// 2. Serve ALL static files from navisdesk/
$staticFile = $root . $request;
if (file_exists($staticFile) && !is_dir($staticFile)) {
    $ext = strtolower(pathinfo($staticFile, PATHINFO_EXTENSION));
    $mimes = [
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
        'svg'  => 'image/svg+xml',
        'woff' => 'font/woff',
        'woff2'=> 'font/woff2',
        'ttf'  => 'font/ttf',
        'ico'  => 'image/x-icon',
        'json' => 'application/json',
    ];
    $mime = $mimes[$ext] ?? 'application/octet-stream';
    header("Content-Type: $mime");
    header("Cache-Control: public, max-age=3600");
    readfile($staticFile);
    exit;
}

// 3. Serve PHP API files (auth/, php/)
$phpFile = __DIR__ . $request;
if (file_exists($phpFile) && pathinfo($phpFile, PATHINFO_EXTENSION) === 'php') {
    require $phpFile;
    exit;
}

// 4. 404
http_response_code(404);
echo 'Not found';
?>