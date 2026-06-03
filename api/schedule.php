<?php
require_once 'config.php';

header('Content-Type: application/json');

$day = isset($_GET['day']) ? $_GET['day'] : 'saturday';

$response = [
    'status' => 'success',
    'data' => []
];

try {
    $query = "SELECT id, name, time, stage, description FROM schedule WHERE day = ? ORDER BY time ASC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $day);
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($row = $result->fetch_assoc()) {
        $response['data'][] = $row;
    }
    
    // Default data if no database results
    if (empty($response['data'])) {
        $response['data'] = [
            ['id' => 1, 'name' => 'Artist One', 'time' => '12:00', 'stage' => 'Main Stage', 'description' => 'A high-energy opener with live beats, visuals and a warm festival welcome.'],
            ['id' => 2, 'name' => 'Artist Two', 'time' => '14:30', 'stage' => 'Side Stage', 'description' => 'A lively set featuring fresh sounds, local talent and an interactive crowd moment.'],
            ['id' => 3, 'name' => 'Artist Three', 'time' => '16:00', 'stage' => 'Main Stage', 'description' => 'An inspiring performance with a mix of music, talks and festival atmosphere.'],
        ];
    }
    
    $stmt->close();
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
