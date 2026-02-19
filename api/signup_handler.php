<?php
require_once 'config.php';
require_once 'email_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

// Support both JSON and FormData
$name = sanitizeInput($input['name'] ?? $_POST['name'] ?? '');
$email = sanitizeInput($input['email'] ?? $_POST['email'] ?? '');
$mobile = sanitizeInput($input['mobile'] ?? $_POST['mobile'] ?? '');
$aadhaar = sanitizeInput($input['aadhaar'] ?? $_POST['aadhaar'] ?? '');
$password = $input['password'] ?? $_POST['password'] ?? '';
$confirmPassword = $input['confirmPassword'] ?? $_POST['confirmPassword'] ?? '';

// Validation
if (empty($name) || empty($email) || empty($mobile) || empty($password)) {
    sendResponse(false, 'All fields are required');
}

if (!validateEmail($email)) {
    sendResponse(false, 'Invalid email format');
}

if (strlen($password) < 6) {
    sendResponse(false, 'Password must be at least 6 characters');
}

if ($password !== $confirmPassword) {
    sendResponse(false, 'Passwords do not match');
}

if (!empty($aadhaar) && strlen($aadhaar) !== 12) {
    sendResponse(false, 'Aadhaar must be 12 digits');
}

// Database connection
$conn = getDBConnection();

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    sendResponse(false, 'Email already registered');
}

// Check if mobile already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE mobile = ?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    sendResponse(false, 'Mobile number already registered');
}

// Hash password
$hashedPassword = hashPassword($password);

// Insert user
$stmt = $conn->prepare("INSERT INTO users (name, email, mobile, aadhaar_number, password, role, status) VALUES (?, ?, ?, ?, ?, 'citizen', 'active')");
$stmt->bind_param("sssss", $name, $email, $mobile, $aadhaar, $hashedPassword);

if ($stmt->execute()) {
    $userId = $conn->insert_id;
    
    // Send registration email
    $emailTemplate = EmailTemplates::getRegistrationEmail($name, $email);
    sendEmail($email, $emailTemplate['subject'], $emailTemplate['body']);
    
    // Start session
    startSecureSession();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = 'citizen';
    
    sendResponse(true, 'Registration successful! Check your email for confirmation.', [
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'citizen'
        ],
        'redirect' => 'user_dashboard.html'
    ]);
} else {
    sendResponse(false, 'Registration failed. Please try again');
}
?>
