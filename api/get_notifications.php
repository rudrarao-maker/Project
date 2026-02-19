<?php
/**
 * Get Notifications API
 * Fetch notification history for admin panel
 */

header('Content-Type: application/json');
require_once 'config.php';

session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// Get filter parameters
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$type = isset($_GET['type']) ? $_GET['type'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Build query
$query = "SELECT n.*, u.username, u.email, u.phone 
          FROM notifications n 
          LEFT JOIN users u ON n.user_id = u.id 
          WHERE 1=1";

$params = [];
$types = '';

if ($userId) {
    $query .= " AND n.user_id = ?";
    $params[] = $userId;
    $types .= 'i';
}

if ($type && in_array($type, ['email', 'sms'])) {
    $query .= " AND n.type = ?";
    $params[] = $type;
    $types .= 's';
}

if ($status && in_array($status, ['sent', 'failed'])) {
    $query .= " AND n.status = ?";
    $params[] = $status;
    $types .= 's';
}

$query .= " ORDER BY n.sent_at DESC LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

// Execute query
$stmt = $conn->prepare($query);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

// Get total count
$countQuery = "SELECT COUNT(*) as total FROM notifications WHERE 1=1";
if ($userId) {
    $countQuery .= " AND user_id = $userId";
}
if ($type) {
    $countQuery .= " AND type = '$type'";
}
if ($status) {
    $countQuery .= " AND status = '$status'";
}

$countResult = $conn->query($countQuery);
$totalCount = $countResult->fetch_assoc()['total'];

// Get statistics
$statsQuery = "SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN type = 'email' THEN 1 ELSE 0 END) as total_emails,
    SUM(CASE WHEN type = 'sms' THEN 1 ELSE 0 END) as total_sms,
    SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as total_sent,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as total_failed
    FROM notifications";

$statsResult = $conn->query($statsQuery);
$stats = $statsResult->fetch_assoc();

echo json_encode([
    'success' => true,
    'notifications' => $notifications,
    'total' => $totalCount,
    'stats' => $stats,
    'limit' => $limit,
    'offset' => $offset
]);

$stmt->close();
$conn->close();
?>
