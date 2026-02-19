<?php
/**
 * Get Pending Documents for Admin Review
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
$status = isset($_GET['status']) ? $_GET['status'] : 'pending';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Build query
$query = "SELECT d.*, u.name as user_name, u.email, u.mobile
    FROM document_uploads d 
    LEFT JOIN users u ON d.user_id = u.id 
    WHERE d.status = ?
    ORDER BY d.uploaded_at DESC
    LIMIT ? OFFSET ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("sii", $status, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$documents = [];
while ($row = $result->fetch_assoc()) {
    $documents[] = $row;
}

// Get total count
$countQuery = "SELECT COUNT(*) as total FROM document_uploads WHERE status = ?";
$countStmt = $conn->prepare($countQuery);
$countStmt->bind_param("s", $status);
$countStmt->execute();
$totalCount = $countStmt->get_result()->fetch_assoc()['total'];

// Get statistics
$statsQuery = "SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM document_uploads";

$statsResult = $conn->query($statsQuery);
$stats = $statsResult->fetch_assoc();

echo json_encode([
    'success' => true,
    'documents' => $documents,
    'total' => $totalCount,
    'stats' => $stats,
    'limit' => $limit,
    'offset' => $offset
]);

$stmt->close();
$conn->close();
?>
