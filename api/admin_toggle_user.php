<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

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

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
$targetUserId = $input['user_id'] ?? 0;
$newStatus = $input['status'] ?? '';

if (empty($targetUserId) || empty($newStatus)) {
    sendResponse(false, 'User ID and status are required');
}

// Don't allow admin to suspend themselves
if ($targetUserId == $userId) {
    sendResponse(false, 'Cannot change your own status');
}

// Update user status
$stmt = $conn->prepare("UPDATE users SET status = ? WHERE id = ?");
$stmt->bind_param("si", $newStatus, $targetUserId);

if ($stmt->execute()) {
    sendResponse(true, 'User status updated successfully');
} else {
    sendResponse(false, 'Failed to update user status');
}
?>
