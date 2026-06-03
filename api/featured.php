<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = [
    'status' => 'success',
    'data' => [
        'title' => 'Welcome to U Festival',
        'description' => 'Join us for an unforgettable festival experience with amazing artists and entertainment.',
        'date' => 'June 15-16, 2024',
        'location' => 'Utrecht, Netherlands'
    ]
];

try {
    $query = "SELECT * FROM featured LIMIT 1";
    $result = $conn->query($query);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response['data'] = $row;
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
