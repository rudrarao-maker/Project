<?php
/**
 * Notification System - Integration Examples
 * Copy these examples into your existing handlers
 */

// ============================================
// EXAMPLE 1: Send Registration Email & SMS
// ============================================
// Add to: api/signup_handler.php (after successful user creation)

require_once 'email_handler.php';
require_once 'sms_handler.php';

// Prepare email data
$emailData = [
    'name' => $fullname,
    'username' => $username,
    'email' => $email
];

// Generate and send email
$emailBody = getEmailTemplate('registration', $emailData);
$emailResult = sendEmail($email, 'Welcome to ' . PORTAL_NAME, $emailBody, $userId);

// Prepare SMS data
$smsData = [
    'name' => $fullname,
    'username' => $username
];

// Generate and send SMS
$smsMessage = getSMSTemplate('registration', $smsData);
$smsResult = sendSMS($phone, $smsMessage, $userId);

// ============================================
// EXAMPLE 2: Application Submitted Notification
// ============================================
// Add to: api/submit_application.php (after application is saved)

require_once 'email_handler.php';
require_once 'sms_handler.php';

// Get user details from database
$stmt = $conn->prepare("SELECT fullname, email, phone FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Prepare notification data
$notificationData = [
    'name' => $user['fullname'],
    'application_id' => $applicationId,
    'service' => $serviceName
];

// Send email
$emailBody = getEmailTemplate('application_submitted', $notificationData);
sendEmail($user['email'], 'Application Submitted Successfully', $emailBody, $userId);

// Send SMS
$smsMessage = getSMSTemplate('application_submitted', $notificationData);
sendSMS($user['phone'], $smsMessage, $userId);

// ============================================
// EXAMPLE 3: Application Status Update
// ============================================
// Add to: api/update_application_status.php (when status changes)

require_once 'email_handler.php';
require_once 'sms_handler.php';

// Get application and user details
$stmt = $conn->prepare("
    SELECT a.application_id, a.service_name, u.fullname, u.email, u.phone, u.id as user_id
    FROM applications a
    JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
");
$stmt->bind_param("i", $applicationDbId);
$stmt->execute();
$data = $stmt->get_result()->fetch_assoc();

// Prepare notification data
$notificationData = [
    'name' => $data['fullname'],
    'application_id' => $data['application_id'],
    'service' => $data['service_name'],
    'remarks' => $remarks
];

// Determine template based on status
$emailType = '';
$emailSubject = '';

if ($newStatus === 'approved') {
    $emailType = 'status_approved';
    $emailSubject = 'Application Approved!';
} elseif ($newStatus === 'rejected') {
    $emailType = 'status_rejected';
    $emailSubject = 'Application Status Update';
} else {
    $emailType = 'status_review';
    $emailSubject = 'Application Under Review';
}

// Send email
$emailBody = getEmailTemplate($emailType, $notificationData);
sendEmail($data['email'], $emailSubject, $emailBody, $data['user_id']);

// Send SMS
$smsMessage = getSMSTemplate($emailType, $notificationData);
sendSMS($data['phone'], $smsMessage, $data['user_id']);

// ============================================
// EXAMPLE 4: Document Upload Notification
// ============================================
// Add to: api/upload_document.php (after successful upload)

require_once 'email_handler.php';
require_once 'sms_handler.php';

// Get user details
$stmt = $conn->prepare("SELECT fullname, email, phone FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Prepare notification data
$notificationData = [
    'name' => $user['fullname'],
    'application_id' => $applicationId,
    'document_type' => $documentType
];

// Custom email template for document upload
$emailBody = getEmailTemplate('application_submitted', $notificationData); // Reuse template
$emailBody = str_replace('application has been submitted', 'document has been uploaded', $emailBody);

sendEmail($user['email'], 'Document Uploaded Successfully', $emailBody, $userId);

// ============================================
// EXAMPLE 5: Appointment Booking
// ============================================
// Add to: api/book_appointment.php (after appointment is created)

require_once 'email_handler.php';
require_once 'sms_handler.php';

// Prepare appointment data
$appointmentData = [
    'name' => $userName,
    'appointment_id' => $appointmentId,
    'application_id' => $applicationId,
    'date' => date('d M Y', strtotime($appointmentDate)),
    'time' => $appointmentTime,
    'location' => $officeLocation,
    'purpose' => $appointmentPurpose
];

// Send email
$emailBody = getEmailTemplate('appointment', $appointmentData);
sendEmail($userEmail, 'Appointment Confirmation', $emailBody, $userId);

// Send SMS
$smsMessage = getSMSTemplate('appointment', $appointmentData);
sendSMS($userPhone, $smsMessage, $userId);

// ============================================
// EXAMPLE 6: Send OTP for Verification
// ============================================
// Add to: api/send_otp.php or login handler

require_once 'sms_handler.php';

// Generate OTP
$otp = rand(100000, 999999);

// Store OTP in session or database
$_SESSION['otp'] = $otp;
$_SESSION['otp_expiry'] = time() + 600; // 10 minutes

// Send OTP via SMS
$otpData = ['otp' => $otp];
$smsMessage = getSMSTemplate('otp', $otpData);
$result = sendSMS($phone, $smsMessage, $userId);

if ($result['success']) {
    echo json_encode(['success' => true, 'message' => 'OTP sent successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send OTP']);
}

// ============================================
// EXAMPLE 7: Appointment Reminder (Cron Job)
// ============================================
// Create: api/send_appointment_reminders.php
// Run daily via cron: 0 9 * * * php /path/to/api/send_appointment_reminders.php

require_once 'config.php';
require_once 'sms_handler.php';

// Get appointments for tomorrow
$tomorrow = date('Y-m-d', strtotime('+1 day'));

$stmt = $conn->prepare("
    SELECT a.*, u.fullname, u.phone, u.id as user_id
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    WHERE DATE(a.appointment_date) = ?
    AND a.status = 'confirmed'
");
$stmt->bind_param("s", $tomorrow);
$stmt->execute();
$appointments = $stmt->get_result();

while ($appointment = $appointments->fetch_assoc()) {
    $reminderData = [
        'time' => $appointment['appointment_time'],
        'location' => $appointment['location']
    ];
    
    $smsMessage = getSMSTemplate('appointment_reminder', $reminderData);
    sendSMS($appointment['phone'], $smsMessage, $appointment['user_id']);
}

// ============================================
// EXAMPLE 8: Document Required Notification
// ============================================
// Add to: api/request_document.php

require_once 'email_handler.php';
require_once 'sms_handler.php';

$documentData = [
    'name' => $userName,
    'application_id' => $applicationId,
    'document_type' => $requiredDocument
];

// Send SMS
$smsMessage = getSMSTemplate('document_required', $documentData);
sendSMS($userPhone, $smsMessage, $userId);

// ============================================
// EXAMPLE 9: Bulk Notifications
// ============================================
// Send to multiple users

require_once 'email_handler.php';
require_once 'sms_handler.php';

// Get all users who need notification
$stmt = $conn->query("SELECT id, fullname, email, phone FROM users WHERE status = 'active'");

while ($user = $stmt->fetch_assoc()) {
    $data = [
        'name' => $user['fullname'],
        'message' => 'Important announcement: System maintenance scheduled for tomorrow.'
    ];
    
    // Send email
    $emailBody = getEmailTemplate('default', $data);
    sendEmail($user['email'], 'System Announcement', $emailBody, $user['id']);
    
    // Optional: Add delay to avoid rate limiting
    usleep(100000); // 0.1 second delay
}

// ============================================
// EXAMPLE 10: Error Handling
// ============================================

require_once 'email_handler.php';

$result = sendEmail($email, $subject, $body, $userId);

if ($result['success']) {
    // Email sent successfully
    $response = ['success' => true, 'message' => 'Notification sent'];
} else {
    // Email failed - log and handle
    error_log("Email failed: " . $result['message']);
    
    // Try alternative notification method (SMS)
    $smsResult = sendSMS($phone, "Check your email for updates", $userId);
    
    if ($smsResult['success']) {
        $response = ['success' => true, 'message' => 'Notification sent via SMS'];
    } else {
        $response = ['success' => false, 'message' => 'All notification methods failed'];
    }
}

echo json_encode($response);

?>
