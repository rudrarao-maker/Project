<?php
/**
 * Test Email Sending Script
 * For testing email notifications
 */

header('Content-Type: application/json');
require_once 'config.php';
require_once 'email_handler.php';

session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email_type = isset($data['email_type']) ? $data['email_type'] : '';
$recipient_email = isset($data['recipient_email']) ? trim($data['recipient_email']) : '';

if (!$email_type || !$recipient_email) {
    echo json_encode(['success' => false, 'message' => 'Email type and recipient email are required']);
    exit;
}

if (!filter_var($recipient_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Generate test data based on email type
$testData = [];
$subject = '';

switch ($email_type) {
    case 'registration':
        $testData = [
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => $recipient_email
        ];
        $subject = 'Welcome to ' . PORTAL_NAME;
        break;
    
    case 'application_submitted':
        $testData = [
            'name' => 'Test User',
            'application_id' => 'APP2026' . rand(100000, 999999),
            'service' => 'Aadhaar Card Application'
        ];
        $subject = 'Application Submitted Successfully';
        break;
    
    case 'status_approved':
        $testData = [
            'name' => 'Test User',
            'application_id' => 'APP2026' . rand(100000, 999999),
            'service' => 'Aadhaar Card Application',
            'remarks' => 'All documents verified successfully.'
        ];
        $subject = 'Application Approved!';
        break;
    
    case 'status_rejected':
        $testData = [
            'name' => 'Test User',
            'application_id' => 'APP2026' . rand(100000, 999999),
            'service' => 'Aadhaar Card Application',
            'remarks' => 'Please upload a clearer copy of your address proof.'
        ];
        $subject = 'Application Status Update';
        break;
    
    case 'status_review':
        $testData = [
            'name' => 'Test User',
            'application_id' => 'APP2026' . rand(100000, 999999),
            'service' => 'Aadhaar Card Application',
            'remarks' => 'Additional verification required.'
        ];
        $subject = 'Application Under Review';
        break;
    
    case 'appointment':
        $testData = [
            'name' => 'Test User',
            'appointment_id' => 'APT2026' . rand(100000, 999999),
            'application_id' => 'APP2026' . rand(100000, 999999),
            'date' => date('d M Y', strtotime('+7 days')),
            'time' => '10:00 AM',
            'location' => 'District Office, New Delhi',
            'purpose' => 'Document Verification'
        ];
        $subject = 'Appointment Confirmation';
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid email type']);
        exit;
}

// Generate email template
$emailBody = getEmailTemplate($email_type, $testData);

// Send email
$result = sendEmail($recipient_email, $subject, $emailBody);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Test email sent successfully!',
        'data' => [
            'email_type' => $email_type,
            'recipient' => $recipient_email,
            'subject' => $subject
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send test email: ' . $result['message']
    ]);
}
?>
