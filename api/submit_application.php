<?php
require_once 'config.php';
require_once 'email_config.php';

startSecureSession();

if (!isLoggedIn()) {
    sendResponse(false, 'Please login to submit application');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

$user_id = getUserId();
$input = json_decode(file_get_contents('php://input'), true);

$service_id = isset($input['service_id']) ? intval($input['service_id']) : 0;
$submitted_data = isset($input['data']) ? json_encode($input['data']) : '{}';

if (!$service_id) {
    sendResponse(false, 'Service ID is required');
}

$conn = getDBConnection();

// Get service details
$stmt = $conn->prepare("SELECT name FROM services WHERE id = ?");
$stmt->bind_param("i", $service_id);
$stmt->execute();
$service = $stmt->get_result()->fetch_assoc();

if (!$service) {
    sendResponse(false, 'Invalid service');
}

// Get user details
$stmt = $conn->prepare("SELECT name, email FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Generate application number
$app_number = 'APP' . date('Y') . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT);

// Insert application
$stmt = $conn->prepare("INSERT INTO service_applications (user_id, service_id, application_number, submitted_data, status) VALUES (?, ?, ?, ?, 'pending')");
$stmt->bind_param("iiss", $user_id, $service_id, $app_number, $submitted_data);

if ($stmt->execute()) {
    $application_id = $conn->insert_id;
    
    // Send email notification
    $emailTemplate = EmailTemplates::getApplicationSubmittedEmail(
        $user['name'],
        $service['name'],
        $app_number
    );
    sendEmail($user['email'], $emailTemplate['subject'], $emailTemplate['body']);
    
    sendResponse(true, 'Application submitted successfully! Check your email for confirmation.', [
        'application_id' => $application_id,
        'application_number' => $app_number,
        'service_name' => $service['name']
    ]);
} else {
    sendResponse(false, 'Failed to submit application');
}
?>
