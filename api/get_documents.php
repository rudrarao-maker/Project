<?php
require_once 'config.php';

startSecureSession();

if (!isLoggedIn()) {
    sendResponse(false, 'Please login to view documents');
}

$user_id = getUserId();
$application_id = isset($_GET['application_id']) ? intval($_GET['application_id']) : null;

$conn = getDBConnection();

// Check if user owns this application or is admin
$stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user_result = $stmt->get_result()->fetch_assoc();
$is_admin = $user_result['role'] === 'admin';

if ($application_id && !$is_admin) {
    $stmt = $conn->prepare("SELECT id FROM service_applications WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $application_id, $user_id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows === 0) {
        sendResponse(false, 'Access denied');
    }
}

// Get documents
if ($application_id) {
    $stmt = $conn->prepare("SELECT d.*, u.name as uploaded_by, r.name as reviewed_by_name 
        FROM document_uploads d 
        LEFT JOIN users u ON d.user_id = u.id 
        LEFT JOIN users r ON d.reviewed_by = r.id 
        WHERE d.application_id = ? 
        ORDER BY d.uploaded_at DESC");
    $stmt->bind_param("i", $application_id);
} else {
    // Get all documents for the user
    $stmt = $conn->prepare("SELECT d.*, u.name as uploaded_by, r.name as reviewed_by_name 
        FROM document_uploads d 
        LEFT JOIN users u ON d.user_id = u.id 
        LEFT JOIN users r ON d.reviewed_by = r.id 
        WHERE d.user_id = ? 
        ORDER BY d.uploaded_at DESC");
    $stmt->bind_param("i", $user_id);
}
$stmt->execute();
$result = $stmt->get_result();

$documents = [];
while ($row = $result->fetch_assoc()) {
    $documents[] = $row;
}

sendResponse(true, 'Documents retrieved successfully', $documents);
?>
