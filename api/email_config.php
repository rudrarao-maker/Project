<?php
// Email Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com'); // Change this
define('SMTP_PASSWORD', 'your-app-password'); // Change this - Use App Password for Gmail
define('SMTP_FROM_EMAIL', 'noreply@gov.in');
define('SMTP_FROM_NAME', 'Gov E-Services');

// Email Templates
class EmailTemplates {
    
    public static function getRegistrationEmail($userName, $userEmail) {
        $subject = "Welcome to Gov E-Services - Registration Successful";
        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Welcome to Gov E-Services!</h1>
                </div>
                <div class='content'>
                    <h2>Hello {$userName},</h2>
                    <p>Thank you for registering with Gov E-Services Portal. Your account has been successfully created!</p>
                    
                    <div class='info-box'>
                        <strong>📧 Your Login Email:</strong> {$userEmail}<br>
                        <strong>🔐 Account Status:</strong> Active
                    </div>
                    
                    <p><strong>What you can do now:</strong></p>
                    <ul>
                        <li>Apply for government services (Aadhaar, PAN, Passport, etc.)</li>
                        <li>Browse and apply for government schemes</li>
                        <li>Track your application status</li>
                        <li>Upload required documents</li>
                        <li>Receive notifications on application updates</li>
                    </ul>
                    
                    <center>
                        <a href='http://localhost/Project/login.html' class='button'>Login to Your Account</a>
                    </center>
                    
                    <p style='margin-top: 30px;'><strong>Need Help?</strong><br>
                    Contact our support team at support@gov.in or call 1800-XXX-XXXX</p>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2026 Government of India. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return ['subject' => $subject, 'body' => $body];
    }
    
    public static function getApplicationSubmittedEmail($userName, $serviceName, $applicationNumber) {
        $subject = "Application Submitted - {$applicationNumber}";
        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 5px; }
                .status-badge { background: #fbbf24; color: #78350f; padding: 5px 15px; border-radius: 20px; font-weight: bold; display: inline-block; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>✅ Application Submitted Successfully!</h1>
                </div>
                <div class='content'>
                    <h2>Hello {$userName},</h2>
                    <p>Your application has been successfully submitted and is now under review.</p>
                    
                    <div class='info-box'>
                        <strong>📋 Service:</strong> {$serviceName}<br>
                        <strong>🔢 Application Number:</strong> <span style='color: #667eea; font-size: 18px; font-weight: bold;'>{$applicationNumber}</span><br>
                        <strong>📅 Submitted On:</strong> " . date('d M Y, h:i A') . "<br>
                        <strong>📊 Status:</strong> <span class='status-badge'>PENDING</span>
                    </div>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Upload required documents (if not already done)</li>
                        <li>Wait for admin review and verification</li>
                        <li>You will receive email updates on status changes</li>
                        <li>Track your application status in your dashboard</li>
                    </ol>
                    
                    <center>
                        <a href='http://localhost/Project/user_dashboard.html' class='button'>View Application Status</a>
                    </center>
                    
                    <p style='margin-top: 30px; background: #fef3c7; padding: 15px; border-radius: 5px;'>
                        <strong>⚠️ Important:</strong> Please keep your application number safe for future reference.
                    </p>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2026 Government of India. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return ['subject' => $subject, 'body' => $body];
    }
    
    public static function getApplicationApprovedEmail($userName, $serviceName, $applicationNumber, $remarks = '') {
        $subject = "Application Approved - {$applicationNumber}";
        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 5px; }
                .status-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; display: inline-block; }
                .celebration { font-size: 50px; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div class='celebration'>🎉 🎊 ✨</div>
                    <h1>Congratulations! Application Approved</h1>
                </div>
                <div class='content'>
                    <h2>Hello {$userName},</h2>
                    <p>Great news! Your application has been <strong>APPROVED</strong> by our team.</p>
                    
                    <div class='info-box'>
                        <strong>📋 Service:</strong> {$serviceName}<br>
                        <strong>🔢 Application Number:</strong> <span style='color: #10b981; font-size: 18px; font-weight: bold;'>{$applicationNumber}</span><br>
                        <strong>📅 Approved On:</strong> " . date('d M Y, h:i A') . "<br>
                        <strong>📊 Status:</strong> <span class='status-badge'>APPROVED</span>
                    </div>
                    
                    " . ($remarks ? "<div style='background: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                        <strong>💬 Admin Remarks:</strong><br>{$remarks}
                    </div>" : "") . "
                    
                    <p><strong>What's Next?</strong></p>
                    <ul>
                        <li>Your application is now in the final processing stage</li>
                        <li>You will receive your document/certificate soon</li>
                        <li>Check your dashboard for delivery updates</li>
                        <li>Keep your application number for tracking</li>
                    </ul>
                    
                    <center>
                        <a href='http://localhost/Project/user_dashboard.html' class='button'>View Dashboard</a>
                    </center>
                    
                    <p style='margin-top: 30px; text-align: center;'>
                        <strong>Thank you for using Gov E-Services!</strong>
                    </p>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2026 Government of India. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return ['subject' => $subject, 'body' => $body];
    }
    
    public static function getApplicationRejectedEmail($userName, $serviceName, $applicationNumber, $remarks = '') {
        $subject = "Application Update - {$applicationNumber}";
        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .info-box { background: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 5px; }
                .status-badge { background: #ef4444; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; display: inline-block; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Application Status Update</h1>
                </div>
                <div class='content'>
                    <h2>Hello {$userName},</h2>
                    <p>We regret to inform you that your application requires attention.</p>
                    
                    <div class='info-box'>
                        <strong>📋 Service:</strong> {$serviceName}<br>
                        <strong>🔢 Application Number:</strong> <span style='color: #ef4444; font-size: 18px; font-weight: bold;'>{$applicationNumber}</span><br>
                        <strong>📅 Reviewed On:</strong> " . date('d M Y, h:i A') . "<br>
                        <strong>📊 Status:</strong> <span class='status-badge'>REQUIRES REVISION</span>
                    </div>
                    
                    " . ($remarks ? "<div style='background: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                        <strong>💬 Reason:</strong><br>{$remarks}
                    </div>" : "") . "
                    
                    <p><strong>What You Can Do:</strong></p>
                    <ul>
                        <li>Review the remarks provided by our team</li>
                        <li>Upload correct/additional documents if required</li>
                        <li>Resubmit your application with corrections</li>
                        <li>Contact support if you need assistance</li>
                    </ul>
                    
                    <center>
                        <a href='http://localhost/Project/user_dashboard.html' class='button'>View Application</a>
                    </center>
                    
                    <p style='margin-top: 30px; background: #dbeafe; padding: 15px; border-radius: 5px;'>
                        <strong>💡 Need Help?</strong> Contact our support team at support@gov.in or call 1800-XXX-XXXX
                    </p>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2026 Government of India. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return ['subject' => $subject, 'body' => $body];
    }
    
    public static function getDocumentApprovedEmail($userName, $documentType, $applicationNumber) {
        $subject = "Document Approved - {$documentType}";
        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>✅ Document Approved</h1>
                </div>
                <div class='content'>
                    <h2>Hello {$userName},</h2>
                    <p>Your uploaded document has been verified and approved by our team.</p>
                    
                    <div class='info-box'>
                        <strong>📄 Document Type:</strong> {$documentType}<br>
                        <strong>🔢 Application Number:</strong> {$applicationNumber}<br>
                        <strong>📅 Approved On:</strong> " . date('d M Y, h:i A') . "<br>
                        <strong>✅ Status:</strong> Verified & Approved
                    </div>
                    
                    <p>Your application is now one step closer to completion!</p>
                    
                    <center>
                        <a href='http://localhost/Project/user_dashboard.html' class='button'>View Application</a>
                    </center>
                </div>
                <div class='footer'>
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2026 Government of India. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return ['subject' => $subject, 'body' => $body];
    }
}

// Email Sending Function using PHP mail() - Simple version
function sendEmail($to, $subject, $body) {
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">" . "\r\n";
    
    // For development, log emails instead of sending
    $logFile = '../email_logs.txt';
    $logEntry = "\n\n" . str_repeat("=", 80) . "\n";
    $logEntry .= "Date: " . date('Y-m-d H:i:s') . "\n";
    $logEntry .= "To: {$to}\n";
    $logEntry .= "Subject: {$subject}\n";
    $logEntry .= str_repeat("-", 80) . "\n";
    $logEntry .= strip_tags($body) . "\n";
    $logEntry .= str_repeat("=", 80) . "\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND);
    
    // Uncomment below to actually send emails (requires mail server configuration)
    // return mail($to, $subject, $body, $headers);
    
    return true; // Return true for development
}
?>
