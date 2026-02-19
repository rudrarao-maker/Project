<?php
require_once 'config.php';

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

// Get total users
$result = $conn->query("SELECT COUNT(*) as total FROM users WHERE role = 'citizen'");
$totalUsers = $result->fetch_assoc()['total'];

// Get total applications
$result = $conn->query("SELECT COUNT(*) as total FROM service_applications");
$totalApplications = $result->fetch_assoc()['total'];

// Get pending applications
$result = $conn->query("SELECT COUNT(*) as total FROM service_applications WHERE status = 'pending'");
$pendingApplications = $result->fetch_assoc()['total'];

// Get approved applications
$result = $conn->query("SELECT COUNT(*) as total FROM service_applications WHERE status = 'approved'");
$approvedApplications = $result->fetch_assoc()['total'];

// Get rejected applications
$result = $conn->query("SELECT COUNT(*) as total FROM service_applications WHERE status = 'rejected'");
$rejectedApplications = $result->fetch_assoc()['total'];

// Get total services
$result = $conn->query("SELECT COUNT(*) as total FROM services WHERE status = 'active'");
$totalServices = $result->fetch_assoc()['total'];

// Get total schemes
$result = $conn->query("SELECT COUNT(*) as total FROM schemes WHERE status = 'active'");
$totalSchemes = $result->fetch_assoc()['total'];

// Get pending documents
$result = $conn->query("SELECT COUNT(*) as total FROM document_uploads WHERE status = 'pending'");
$pendingDocuments = $result->fetch_assoc()['total'];

// Calculate revenue (sum of service fees from approved applications)
$result = $conn->query("
    SELECT COALESCE(SUM(s.fees), 0) as total 
    FROM service_applications sa 
    JOIN services s ON sa.service_id = s.id 
    WHERE sa.status = 'approved'
");
$totalRevenue = $result->fetch_assoc()['total'];

// Get new users this month
$result = $conn->query("
    SELECT COUNT(*) as total 
    FROM users 
    WHERE role = 'citizen' 
    AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
    AND YEAR(created_at) = YEAR(CURRENT_DATE())
");
$newUsersThisMonth = $result->fetch_assoc()['total'];

// Get applications this month
$result = $conn->query("
    SELECT COUNT(*) as total 
    FROM service_applications 
    WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
    AND YEAR(created_at) = YEAR(CURRENT_DATE())
");
$applicationsThisMonth = $result->fetch_assoc()['total'];

// Get monthly data for last 6 months
$monthlyData = [];
for ($i = 5; $i >= 0; $i--) {
    $month = date('Y-m', strtotime("-$i months"));
    $monthName = date('M Y', strtotime("-$i months"));
    
    // Users registered
    $result = $conn->query("
        SELECT COUNT(*) as total 
        FROM users 
        WHERE role = 'citizen' 
        AND DATE_FORMAT(created_at, '%Y-%m') = '$month'
    ");
    $users = $result->fetch_assoc()['total'];
    
    // Applications submitted
    $result = $conn->query("
        SELECT COUNT(*) as total 
        FROM service_applications 
        WHERE DATE_FORMAT(created_at, '%Y-%m') = '$month'
    ");
    $applications = $result->fetch_assoc()['total'];
    
    // Revenue
    $result = $conn->query("
        SELECT COALESCE(SUM(s.fees), 0) as total 
        FROM service_applications sa 
        JOIN services s ON sa.service_id = s.id 
        WHERE sa.status = 'approved' 
        AND DATE_FORMAT(sa.created_at, '%Y-%m') = '$month'
    ");
    $revenue = $result->fetch_assoc()['total'];
    
    $monthlyData[] = [
        'month' => $monthName,
        'users' => (int)$users,
        'applications' => (int)$applications,
        'revenue' => (float)$revenue
    ];
}

// Get recent activity (last 10 activities)
$recentActivity = [];

// Recent applications
$result = $conn->query("
    SELECT 'application' as type, sa.application_number, sa.status, sa.created_at, 
           u.name as user_name, s.name as service_name
    FROM service_applications sa
    JOIN users u ON sa.user_id = u.id
    JOIN services s ON sa.service_id = s.id
    ORDER BY sa.created_at DESC
    LIMIT 10
");

while ($row = $result->fetch_assoc()) {
    $recentActivity[] = $row;
}

// Get top services by applications
$result = $conn->query("
    SELECT s.name, COUNT(sa.id) as count
    FROM services s
    LEFT JOIN service_applications sa ON s.id = sa.service_id
    GROUP BY s.id
    ORDER BY count DESC
    LIMIT 5
");

$topServices = [];
while ($row = $result->fetch_assoc()) {
    $topServices[] = $row;
}

// Get application status distribution
$statusDistribution = [
    'pending' => $pendingApplications,
    'approved' => $approvedApplications,
    'rejected' => $rejectedApplications,
    'in_progress' => 0
];

$result = $conn->query("SELECT COUNT(*) as total FROM service_applications WHERE status = 'in_progress'");
$statusDistribution['in_progress'] = $result->fetch_assoc()['total'];

sendResponse(true, 'Dashboard statistics retrieved', [
    'overview' => [
        'totalUsers' => (int)$totalUsers,
        'totalApplications' => (int)$totalApplications,
        'totalServices' => (int)$totalServices,
        'totalSchemes' => (int)$totalSchemes,
        'totalRevenue' => (float)$totalRevenue,
        'pendingApplications' => (int)$pendingApplications,
        'approvedApplications' => (int)$approvedApplications,
        'rejectedApplications' => (int)$rejectedApplications,
        'pendingDocuments' => (int)$pendingDocuments,
        'newUsersThisMonth' => (int)$newUsersThisMonth,
        'applicationsThisMonth' => (int)$applicationsThisMonth
    ],
    'monthlyData' => $monthlyData,
    'recentActivity' => $recentActivity,
    'topServices' => $topServices,
    'statusDistribution' => $statusDistribution
]);
?>
