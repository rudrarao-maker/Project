<?php
/**
 * Test SMS Sending Script
 * For testing SMS notifications
 */

header('Content-Type: application/json');
require_once 'config.php';
require_once 'sms_handler.php';

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
$sms_type = isset($data['sms_type']) ? $data['sms_type'] : '';
$recipient_phone = isset($data['recipient_phone']) ? trim($data['recipient_phone']) : '';

if (!$sms_type || !$recipient_phone) {
    echo json_encode(['success' => false, 'message' => 'SMS type and recipient phone are required']);
    exit;
}

// Validate phone number
$phone = preg_replace('/[^0-9]/', '', $recipient_phone);
if (strlen($phone) != 10) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number. Must be 10 digits.']);
    exit;
}

// Generate test data based on SMS type
$testData = [];

switch ($sms_type) {
    case 'registration':
        $testData = [
            'name' => 'Test User',
            'username' => 'testuser'
        ];
        break;
    
    case 'application_submitted':
        $testData = [
            'application_id' => 'APP2026' . rand(100000, 999999),
            'service' => 'Aadhaar Card'
        ];
        break;
    
    case 'status_approved':
        $testData = [
            'application_id' => 'APP2026' . rand(100000, 999999)
        ];
        break;
    
    case 'status_rejected':
        $testData = [
            'application_id' => 'APP2026' . rand(100000, 999999),
            'remarks' => 'Document unclear'
        ];
        break;
    
    case 'status_review':
        $testData = [
            'application_id' => 'APP2026' . rand(100000, 999999)
        ];
        break;
    
    case 'appointment':
        $testData = [
            'appointment_id' => 'APT2026' . rand(100000, 999999),
            'application_id' => 'APP2026' . rand(100000, 999999),
            'date' => date('d M Y', strtotime('+7 days')),
            'time' => '10:00 AM',
            'location' => 'District Office'
        ];
        break;
    
    case 'appointment_reminder':
        $testData = [
            'time' => '10:00 AM',
            'location' => 'District Office, New Delhi'
        ];
        break;
    
    case 'document_required':
        $testData = [
            'application_id' => 'APP2026' . rand(100000, 999999),
            'document_type' => 'Address Proof'
        ];
        break;
    
    case 'otp':
        $testData = [
            'otp' => rand(100000, 999999)
        ];
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid SMS type']);
        exit;
}

// Generate SMS message
$message = getSMSTemplate($sms_type, $testData);

// Send SMS
$result = sendSMS($phone, $message);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'message' => 'Test SMS sent successfully!',
        'data' => [
            'sms_type' => $sms_type,
            'recipient' => $phone,
            'message' => $message
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send test SMS: ' . $result['message']
    ]);
}
?>
