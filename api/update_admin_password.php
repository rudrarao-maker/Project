<?php
require_once 'config.php';

// Create new password hash for "test123"
$newPassword = 'test123';
$hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

echo "New password hash: " . $hashedPassword . "<br><br>";

// Update admin password
$conn = getDBConnection();

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = 'admin@gov.in'");
$stmt->bind_param("s", $hashedPassword);

if ($stmt->execute()) {
    echo "✅ Admin password updated successfully!<br>";
    echo "Email: admin@gov.in<br>";
    echo "Password: test123<br><br>";
    
    // Verify the password works
    $checkStmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = 'admin@gov.in'");
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $user = $result->fetch_assoc();
    
    if (password_verify('test123', $user['password'])) {
        echo "✅ Password verification successful!<br>";
        echo "You can now login with: admin@gov.in / test123";
    } else {
        echo "❌ Password verification failed!";
    }
} else {
    echo "❌ Error updating password: " . $stmt->error;
}

$conn->close();
?>
