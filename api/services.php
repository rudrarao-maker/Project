<?php
require_once 'config.php';

$conn = getDBConnection();

// Get query parameters
$category = $_GET['category'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build query
$query = "SELECT * FROM services WHERE status = 'active'";
$params = [];
$types = "";

if ($category !== 'all') {
    $query .= " AND category = ?";
    $params[] = $category;
    $types .= "s";
}

if (!empty($search)) {
    $query .= " AND (name LIKE ? OR description LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= "ss";
}

$query .= " ORDER BY name ASC";

// Prepare and execute
$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$services = [];
while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}

sendResponse(true, 'Services retrieved successfully', ['services' => $services]);
?>
