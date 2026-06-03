<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = [
    'status' => 'success',
    'data' => [
        'title' => 'Festival Information',
        'description' => "Lorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euam festde ut-elegant, elenendi les risus.\n\nLorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euavi festa ut-elegant, elenendi les risus.\n\nLorem ipsum dolor ant sam. consectetur adipiscing elit. Aliquam at euavi festa ut-elegant, elenendi les risus.",
        'location' => 'Utrecht, Netherlands',
        'dates' => 'June 15-16, 2024',
        'tickets' => 'Available online'
    ]
];

try {
    $query = "SELECT * FROM festival_info LIMIT 1";
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
