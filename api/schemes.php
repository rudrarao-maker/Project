<?php
require_once 'config.php';

$conn = getDBConnection();

// Get query parameters
$state = $_GET['state'] ?? 'all';
$category = $_GET['category'] ?? 'all';

// Build query
$query = "SELECT * FROM schemes WHERE status = 'active'";
$params = [];
$types = "";

if ($state !== 'all') {
    $query .= " AND state = ?";
    $params[] = $state;
    $types .= "s";
}

if ($category !== 'all') {
    $query .= " AND category = ?";
    $params[] = $category;
    $types .= "s";
}

$query .= " ORDER BY state, name ASC";

// Prepare and execute
$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$schemes = [];
while ($row = $result->fetch_assoc()) {
    $schemes[] = $row;
}

sendResponse(true, 'Schemes retrieved successfully', ['schemes' => $schemes]);
?>
