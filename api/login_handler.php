<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

// Support both JSON and FormData
$email = sanitizeInput($input['email'] ?? $_POST['email'] ?? '');
$password = $input['password'] ?? $_POST['password'] ?? '';

// Validation
if (empty($email) || empty($password)) {
    sendResponse(false, 'Email and password are required');
}

if (!validateEmail($email)) {
    sendResponse(false, 'Invalid email format');
}

// Database connection
$conn = getDBConnection();

// Check user exists
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ? AND status = 'active'");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(false, 'Invalid email or password');
}

$user = $result->fetch_assoc();

// Verify password
if (!verifyPassword($password, $user['password'])) {
    sendResponse(false, 'Invalid email or password');
}

// Start session
startSecureSession();
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_role'] = $user['role'];

// Update last login
$updateStmt = $conn->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?");
$updateStmt->bind_param("i", $user['id']);
$updateStmt->execute();

// Return user data (without password)
unset($user['password']);

sendResponse(true, 'Login successful', [
    'user' => $user,
    'redirect' => 'user_dashboard.html'
]);
?>
