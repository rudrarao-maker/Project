<?php
require_once 'config.php';
require_once 'email_config.php';

startSecureSession();

if (!isLoggedIn()) {
    sendResponse(false, 'Please login');
}

$user_id = getUserId();
$conn = getDBConnection();

// Check if user is admin
$stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user['role'] !== 'admin') {
    sendResponse(false, 'Access denied. Admin only.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

$data = json_decode(file_get_contents('php://input'), true);
$application_id = isset($data['application_id']) ? intval($data['application_id']) : 0;
$status = isset($data['status']) ? $data['status'] : '';
$remarks = isset($data['remarks']) ? sanitizeInput($data['remarks']) : '';

if (!$application_id || !in_array($status, ['pending', 'in_progress', 'approved', 'rejected'])) {
    sendResponse(false, 'Invalid data');
}

// Get application details with user and service info
$stmt = $conn->prepare("
    SELECT a.application_number, a.user_id, u.name as user_name, u.email as user_email, 
           s.name as service_name
    FROM service_applications a
    JOIN users u ON a.user_id = u.id
    JOIN services s ON a.service_id = s.id
    WHERE a.id = ?
");
$stmt->bind_param("i", $application_id);
$stmt->execute();
$application = $stmt->get_result()->fetch_assoc();

if (!$application) {
    sendResponse(false, 'Application not found');
}

// Update application status
$stmt = $conn->prepare("UPDATE service_applications SET status = ?, remarks = ?, updated_at = NOW() WHERE id = ?");
$stmt->bind_param("ssi", $status, $remarks, $application_id);

if ($stmt->execute()) {
    // Send email notification based on status
    if ($status === 'approved') {
        $emailTemplate = EmailTemplates::getApplicationApprovedEmail(
            $application['user_name'],
            $application['service_name'],
            $application['application_number'],
            $remarks
        );
        sendEmail($application['user_email'], $emailTemplate['subject'], $emailTemplate['body']);
    } elseif ($status === 'rejected') {
        $emailTemplate = EmailTemplates::getApplicationRejectedEmail(
            $application['user_name'],
            $application['service_name'],
            $application['application_number'],
            $remarks
        );
        sendEmail($application['user_email'], $emailTemplate['subject'], $emailTemplate['body']);
    }
    
    sendResponse(true, 'Application status updated and email sent to user', [
        'status' => $status,
        'application_number' => $application['application_number']
    ]);
} else {
    sendResponse(false, 'Failed to update application status');
}
?>
