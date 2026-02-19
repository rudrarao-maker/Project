<?php
/**
 * Review Document - Approve or Reject
 */

header('Content-Type: application/json');
require_once 'config.php';

// Check if notification system is available
$notificationAvailable = file_exists('email_handler.php') && file_exists('sms_handler.php');
if ($notificationAvailable) {
    require_once 'email_handler.php';
    require_once 'sms_handler.php';
}

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
$document_id = isset($data['document_id']) ? intval($data['document_id']) : 0;
$status = isset($data['status']) ? $data['status'] : '';
$remarks = isset($data['remarks']) ? trim($data['remarks']) : '';

if (!$document_id || !in_array($status, ['approved', 'rejected'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Get document details with user info
$stmt = $conn->prepare("
    SELECT d.*, u.name as user_name, u.email, u.mobile, u.id as user_id
    FROM document_uploads d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.id = ?
");
$stmt->bind_param("i", $document_id);
$stmt->execute();
$document = $stmt->get_result()->fetch_assoc();

if (!$document) {
    echo json_encode(['success' => false, 'message' => 'Document not found']);
    exit;
}

// Get admin ID from session
$admin_id = isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : 1;

// Update document status
$updateStmt = $conn->prepare("UPDATE document_uploads SET status = ?, admin_remarks = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?");
$updateStmt->bind_param("ssii", $status, $remarks, $admin_id, $document_id);

if ($updateStmt->execute()) {
    // Send notifications if available
    if ($notificationAvailable && $document['user_email']) {
        $notificationData = [
            'name' => $document['user_name'],
            'document_type' => $document['document_type'],
            'application_id' => $document['application_id'] ? $document['application_id'] : 'N/A',
            'remarks' => $remarks
        ];
        
        // Send email
        if ($status === 'approved') {
            $emailBody = getEmailTemplate('status_approved', $notificationData);
            sendEmail($document['user_email'], 'Document Approved', $emailBody, $document['user_id']);
        } else {
            $emailBody = getEmailTemplate('status_rejected', $notificationData);
            sendEmail($document['user_email'], 'Document Review Update', $emailBody, $document['user_id']);
        }
        
        // Send SMS if mobile available
        if ($document['mobile']) {
            $smsData = [
                'application_id' => $document['application_id'] ? $document['application_id'] : 'DOC' . $document_id,
                'remarks' => $remarks
            ];
            $smsMessage = getSMSTemplate($status === 'approved' ? 'status_approved' : 'status_rejected', $smsData);
            sendSMS($document['mobile'], $smsMessage, $document['user_id']);
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Document ' . $status . ' successfully' . ($notificationAvailable ? '. Notification sent to user.' : '.')
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update document status']);
}

$updateStmt->close();
$conn->close();
?>
