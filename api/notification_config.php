<?php
/**
 * Notification Configuration
 * Email and SMS settings for Government Portal
 */

// Email Configuration (SMTP)
define('SMTP_HOST', 'smtp.gmail.com');  // Change to your SMTP host
define('SMTP_PORT', 587);                // 587 for TLS, 465 for SSL
define('SMTP_USERNAME', 'your-email@gmail.com');  // Your email
define('SMTP_PASSWORD', 'your-app-password');     // App password (not regular password)
define('SMTP_FROM_EMAIL', 'noreply@gov.in');
define('SMTP_FROM_NAME', 'Government E-Services Portal');
define('SMTP_ENCRYPTION', 'tls');        // 'tls' or 'ssl'

// For testing, use Mailtrap.io
// define('SMTP_HOST', 'smtp.mailtrap.io');
// define('SMTP_PORT', 2525);
// define('SMTP_USERNAME', 'your-mailtrap-username');
// define('SMTP_PASSWORD', 'your-mailtrap-password');

// SMS Configuration (Fast2SMS)
define('SMS_API_KEY', 'your-fast2sms-api-key');
define('SMS_SENDER_ID', 'GOVIND');  // 6 characters sender ID
define('SMS_API_URL', 'https://www.fast2sms.com/dev/bulkV2');

// Alternative: Twilio Configuration
// define('TWILIO_ACCOUNT_SID', 'your-account-sid');
// define('TWILIO_AUTH_TOKEN', 'your-auth-token');
// define('TWILIO_PHONE_NUMBER', '+1234567890');

// Alternative: MSG91 Configuration
// define('MSG91_AUTH_KEY', 'your-auth-key');
// define('MSG91_SENDER_ID', 'GOVIND');
// define('MSG91_ROUTE', '4');  // 4 for transactional

// Notification Settings
define('ENABLE_EMAIL_NOTIFICATIONS', true);
define('ENABLE_SMS_NOTIFICATIONS', true);
define('LOG_NOTIFICATIONS', true);
define('NOTIFICATION_LOG_FILE', __DIR__ . '/logs/notifications.log');

// Government Portal Details
define('PORTAL_NAME', 'Government E-Services Portal');
define('PORTAL_URL', 'http://localhost/Project/');
define('SUPPORT_EMAIL', 'support@gov.in');
define('SUPPORT_PHONE', '1800-111-555');

// Create logs directory if it doesn't exist
if (!file_exists(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0755, true);
}
?>
