<?php
require_once 'config.php';

startSecureSession();

if (!isLoggedIn()) {
    sendResponse(false, 'Please login to upload documents');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

$user_id = getUserId();
$application_id = isset($_POST['application_id']) ? intval($_POST['application_id']) : null;
$document_type = isset($_POST['document_type']) ? sanitizeInput($_POST['document_type']) : '';

if (!$document_type) {
    sendResponse(false, 'Document type is required');
}

if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, 'Please select a file to upload');
}

$file = $_FILES['document'];
$allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
$max_size = 5 * 1024 * 1024; // 5MB

// Validate file type
if (!in_array($file['type'], $allowed_types)) {
    sendResponse(false, 'Only JPG, PNG, and PDF files are allowed');
}

// Validate file size
if ($file['size'] > $max_size) {
    sendResponse(false, 'File size must be less than 5MB');
}

// Verify application belongs to user (if application_id provided)
if ($application_id) {
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT id FROM service_applications WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $application_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendResponse(false, 'Invalid application');
    }
} else {
    $conn = getDBConnection();
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$unique_name = uniqid() . '_' . time() . '.' . $extension;
$upload_path = '../uploads/documents/' . $unique_name;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
    sendResponse(false, 'Failed to upload file');
}

// Save to database
if ($application_id) {
    $stmt = $conn->prepare("INSERT INTO document_uploads (application_id, user_id, document_type, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisssss", $application_id, $user_id, $document_type, $file['name'], $upload_path, $file['size'], $file['type']);
} else {
    $stmt = $conn->prepare("INSERT INTO document_uploads (user_id, document_type, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssis", $user_id, $document_type, $file['name'], $upload_path, $file['size'], $file['type']);
}

if ($stmt->execute()) {
    sendResponse(true, 'Document uploaded successfully', [
        'document_id' => $conn->insert_id,
        'file_name' => $file['name'],
        'file_size' => $file['size']
    ]);
} else {
    unlink($upload_path);
    sendResponse(false, 'Failed to save document information');
}
?>
