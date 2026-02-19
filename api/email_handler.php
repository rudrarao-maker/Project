<?php
/**
 * Email Notification Handler
 * Uses PHPMailer for sending emails
 */

require_once 'config.php';
require_once 'notification_config.php';

// PHPMailer library (install via Composer: composer require phpmailer/phpmailer)
// Or download from: https://github.com/PHPMailer/PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// If using Composer autoload
// require 'vendor/autoload.php';

// If manual installation, include these files:
// require 'path/to/PHPMailer/src/Exception.php';
// require 'path/to/PHPMailer/src/PHPMailer.php';
// require 'path/to/PHPMailer/src/SMTP.php';

/**
 * Send Email Function
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $message Email body (HTML)
 * @param int $userId User ID for logging
 * @return array Result with success status and message
 */
function sendEmail($to, $subject, $message, $userId = null) {
    global $conn;
    
    if (!ENABLE_EMAIL_NOTIFICATIONS) {
        return ['success' => false, 'message' => 'Email notifications are disabled'];
    }
    
    // Validate email
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        logNotification($userId, 'email', $to, $subject, $message, 'failed', 'Invalid email address');
        return ['success' => false, 'message' => 'Invalid email address'];
    }
    
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port = SMTP_PORT;
        
        // Recipients
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($to);
        $mail->addReplyTo(SUPPORT_EMAIL, PORTAL_NAME);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        $mail->AltBody = strip_tags($message);  // Plain text version
        
        // Send email
        $mail->send();
        
        // Log success
        logNotification($userId, 'email', $to, $subject, $message, 'sent');
        
        return ['success' => true, 'message' => 'Email sent successfully'];
        
    } catch (Exception $e) {
        $errorMsg = "Email could not be sent. Error: {$mail->ErrorInfo}";
        logNotification($userId, 'email', $to, $subject, $message, 'failed', $errorMsg);
        
        if (LOG_NOTIFICATIONS) {
            error_log(date('[Y-m-d H:i:s] ') . $errorMsg . PHP_EOL, 3, NOTIFICATION_LOG_FILE);
        }
        
        return ['success' => false, 'message' => $errorMsg];
    }
}

/**
 * Get Email Template
 * @param string $type Template type
 * @param array $data Template data
 * @return string HTML email template
 */
function getEmailTemplate($type, $data) {
    $header = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #1B4F72; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .footer { background: #F2F4F7; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #1B4F72; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: #F2F4F7; padding: 15px; border-left: 4px solid #1B4F72; margin: 20px 0; }
            .status-approved { color: #28a745; font-weight: bold; }
            .status-rejected { color: #dc3545; font-weight: bold; }
            .status-review { color: #ffc107; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>' . PORTAL_NAME . '</h1>
                <p>Government of India</p>
            </div>
            <div class="content">';
    
    $footer = '
            </div>
            <div class="footer">
                <p><strong>' . PORTAL_NAME . '</strong></p>
                <p>Email: ' . SUPPORT_EMAIL . ' | Phone: ' . SUPPORT_PHONE . '</p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; ' . date('Y') . ' Government of India. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';
    
    $body = '';
    
    switch ($type) {
        case 'registration':
            $body = '
                <h2>Welcome to ' . PORTAL_NAME . '!</h2>
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                <p>Thank you for registering with us. Your account has been created successfully.</p>
                <div class="info-box">
                    <strong>Account Details:</strong><br>
                    Username: ' . htmlspecialchars($data['username']) . '<br>
                    Email: ' . htmlspecialchars($data['email']) . '<br>
                    Registration Date: ' . date('d M Y, h:i A') . '
                </div>
                <p>You can now access all government services through our portal.</p>
                <a href="' . PORTAL_URL . 'login.html" class="button">Login to Your Account</a>
                <p>If you did not create this account, please contact us immediately.</p>';
            break;
            
        case 'application_submitted':
            $body = '
                <h2>Application Submitted Successfully</h2>
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                <p>Your application has been submitted successfully and is now under review.</p>
                <div class="info-box">
                    <strong>Application Details:</strong><br>
                    Application ID: <strong>' . htmlspecialchars($data['application_id']) . '</strong><br>
                    Service: ' . htmlspecialchars($data['service']) . '<br>
                    Submitted On: ' . date('d M Y, h:i A') . '<br>
                    Status: <span class="status-review">Under Review</span>
                </div>
                <p>You will receive updates via email and SMS as your application progresses.</p>
                <a href="' . PORTAL_URL . 'application_tracking.html" class="button">Track Application</a>
                <p>Please keep your Application ID safe for future reference.</p>';
            break;

        case 'status_approved':
            $body = '
                <h2>Application Approved! 🎉</h2>
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                <p>Congratulations! Your application has been approved.</p>
                <div class="info-box">
                    <strong>Application Details:</strong><br>
                    Application ID: <strong>' . htmlspecialchars($data['application_id']) . '</strong><br>
                    Service: ' . htmlspecialchars($data['service']) . '<br>
                    Status: <span class="status-approved">✓ APPROVED</span><br>
                    Approved On: ' . date('d M Y, h:i A') . '
                </div>
                ' . (isset($data['remarks']) ? '<p><strong>Remarks:</strong> ' . htmlspecialchars($data['remarks']) . '</p>' : '') . '
                <p>You can now proceed with the next steps. Please check your dashboard for further instructions.</p>
                <a href="' . PORTAL_URL . 'user_dashboard.html" class="button">View Dashboard</a>';
            break;
            
        case 'status_rejected':
            $body = '
                <h2>Application Status Update</h2>
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                <p>We regret to inform you that your application has been rejected.</p>
                <div class="info-box">
                    <strong>Application Details:</strong><br>
                    Application ID: <strong>' . htmlspecialchars($data['application_id']) . '</strong><br>
                    Service: ' . htmlspecialchars($data['service']) . '<br>
                    Status: <span class="status-rejected">✗ REJECTED</span><br>
                    Updated On: ' . date('d M Y, h:i A') . '
                </div>
                ' . (isset($data['remarks']) ? '<p><strong>Reason:</strong> ' . htmlspecialchars($data['remarks']) . '</p>' : '') . '
                <p>You may reapply after addressing the issues mentioned above.</p>
                <a href="' . PORTAL_URL . 'services_portal.html" class="button">Apply Again</a>';
            break;
            
        case 'status_review':
            $body = '
                <h2>Application Under Review</h2>
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                <p>Your application is currently under review by our team.</p>
                <div class="info-box">
                    <strong>Application Details:</strong><br>
                    Application ID: <strong>' . htmlspecialchars($data['application_id']) . '</strong><br>
                    Service: ' . htmlspecialchars($data['service']) . '<br>
                    Status: <span class="status-review">Under Review</span><br>
                    Updated On: ' . date('d M Y, h:i A') . '
                </div>
                ' . (isset($data['remarks']) ? '<p><strong>Note:</strong> ' . htmlspecialchars($data['remarks']) . '</p>' : '') . '
                <p>We will notify you once the review is complete.</p>
                <a href="' . PORTAL_URL . 'application_tracking.html" class="button">Track Application</a>';
            break;
            
        case 'appointment':
            $body = '
                <h2>Appointment Confirmation</h2>
                <p>Dear ' . htmlspecialchars($data['name']) . ',</p>
                <p>Your appointment has been confirmed successfully.</p>
                <div class="info-box">
                    <strong>Appointment Details:</strong><br>
                    Appointment ID: <strong>' . htmlspecialchars($data['appointment_id']) . '</strong><br>
                    Date: ' . htmlspecialchars($data['date']) . '<br>
                    Time: ' . htmlspecialchars($data['time']) . '<br>
                    Location: ' . htmlspecialchars($data['location']) . '<br>
                    Purpose: ' . htmlspecialchars($data['purpose']) . '
                </div>
                <p><strong>Important:</strong> Please bring the following documents:</p>
                <ul>
                    <li>Valid ID Proof (Aadhaar/PAN/Passport)</li>
                    <li>Application ID: ' . htmlspecialchars($data['application_id']) . '</li>
                    <li>Any supporting documents</li>
                </ul>
                <p>Please arrive 15 minutes before your scheduled time.</p>';
            break;
            
        default:
            $body = '<p>' . $data['message'] . '</p>';
    }
    
    return $header . $body . $footer;
}

/**
 * Log Notification to Database
 */
function logNotification($userId, $type, $recipient, $subject, $message, $status, $errorMsg = null) {
    global $conn;
    
    if (!$conn) return false;
    
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, recipient, subject, message, status, error_message, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("issssss", $userId, $type, $recipient, $subject, $message, $status, $errorMsg);
    $stmt->execute();
    $stmt->close();
}
?>
