<?php
require_once 'config.php';

// Check if user is admin
startSecureSession();
if (!isLoggedIn()) {
    sendResponse(false, 'Unauthorized access');
}

$conn = getDBConnection();

// Get current user role
$userId = getUserId();
$stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$currentUser = $result->fetch_assoc();

if ($currentUser['role'] !== 'admin') {
    sendResponse(false, 'Admin access required');
}

// Get all users
$query = "SELECT id, name, email, mobile, aadhaar_number, role, status, created_at FROM users ORDER BY created_at DESC";
$result = $conn->query($query);

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

sendResponse(true, 'Users retrieved successfully', ['users' => $users]);
?>
