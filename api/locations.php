<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = [
    'status' => 'success',
    'data' => []
];

$method = $_SERVER['REQUEST_METHOD'];
$queryParams = [];
parse_str($_SERVER['QUERY_STRING'] ?? '', $queryParams);
$id = isset($queryParams['id']) ? intval($queryParams['id']) : null;

try {
    if ($method === 'GET') {
        $query = "SELECT id, name, latitude as lat, longitude as lng, type, description FROM locations ORDER BY name ASC";
        $result = $conn->query($query);
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $response['data'][] = $row;
            }
        }
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['name']) || !isset($input['latitude']) || !isset($input['longitude'])) {
            throw new Exception('Naam, latitude en longitude zijn verplicht.');
        }

        $stmt = $conn->prepare("INSERT INTO locations (name, type, latitude, longitude, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssdds', $input['name'], $input['type'], $input['latitude'], $input['longitude'], $input['description']);
        $stmt->execute();
        $response['data'] = [
            'id' => $stmt->insert_id,
            'name' => $input['name'],
            'type' => $input['type'],
            'lat' => $input['latitude'],
            'lng' => $input['longitude'],
            'description' => $input['description'],
        ];
        $stmt->close();
    } elseif ($method === 'PUT') {
        if (!$id) {
            throw new Exception('Geen locatie-id opgegeven.');
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['name']) || !isset($input['latitude']) || !isset($input['longitude'])) {
            throw new Exception('Naam, latitude en longitude zijn verplicht.');
        }

        $stmt = $conn->prepare("UPDATE locations SET name = ?, type = ?, latitude = ?, longitude = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->bind_param('ssddsi', $input['name'], $input['type'], $input['latitude'], $input['longitude'], $input['description'], $id);
        $stmt->execute();
        $response['data'] = [
            'id' => $id,
            'name' => $input['name'],
            'type' => $input['type'],
            'lat' => $input['latitude'],
            'lng' => $input['longitude'],
            'description' => $input['description'],
        ];
        $stmt->close();
    } elseif ($method === 'DELETE') {
        if (!$id) {
            throw new Exception('Geen locatie-id opgegeven.');
        }

        $stmt = $conn->prepare("DELETE FROM locations WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $response['data'] = ['id' => $id];
        $stmt->close();
    } else {
        http_response_code(405);
        $response['status'] = 'error';
        $response['message'] = 'Methode niet toegestaan.';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
