<?php
/**
 * SMS Notification Handler
 * Supports Fast2SMS, Twilio, and MSG91
 */

require_once 'config.php';
require_once 'notification_config.php';

/**
 * Send SMS Function
 * @param string $phone Phone number (10 digits for India)
 * @param string $message SMS message
 * @param int $userId User ID for logging
 * @return array Result with success status and message
 */
function sendSMS($phone, $message, $userId = null) {
    global $conn;
    
    if (!ENABLE_SMS_NOTIFICATIONS) {
        return ['success' => false, 'message' => 'SMS notifications are disabled'];
    }
    
    // Validate and format phone number
    $phone = preg_replace('/[^0-9]/', '', $phone);
    
    if (strlen($phone) != 10) {
        logNotification($userId, 'sms', $phone, null, $message, 'failed', 'Invalid phone number');
        return ['success' => false, 'message' => 'Invalid phone number'];
    }
    
    // Send via Fast2SMS (default)
    $result = sendViaFast2SMS($phone, $message);
    
    // Log notification
    if ($result['success']) {
        logNotification($userId, 'sms', $phone, null, $message, 'sent');
    } else {
        logNotification($userId, 'sms', $phone, null, $message, 'failed', $result['message']);
    }
    
    return $result;
}

/**
 * Get SMS Template
 * @param string $type Template type
 * @param array $data Template data
 * @return string SMS message
 */
function getSMSTemplate($type, $data) {
    $message = '';
    
    switch ($type) {
        case 'registration':
            $message = "Welcome to " . PORTAL_NAME . "! Your account has been created successfully. Username: " . $data['username'] . ". Login at " . PORTAL_URL;
            break;
            
        case 'application_submitted':
            $message = "Your application (ID: " . $data['application_id'] . ") for " . $data['service'] . " has been submitted successfully. Track status at " . PORTAL_URL . "application_tracking.html";
            break;
            
        case 'status_approved':
            $message = "Congratulations! Your application (ID: " . $data['application_id'] . ") has been APPROVED. Check your dashboard for next steps. " . PORTAL_URL;
            break;
            
        case 'status_rejected':
            $message = "Your application (ID: " . $data['application_id'] . ") has been REJECTED. Reason: " . (isset($data['remarks']) ? $data['remarks'] : 'See email for details') . ". You may reapply.";
            break;
            
        case 'status_review':
            $message = "Your application (ID: " . $data['application_id'] . ") is under review. You will be notified once the review is complete. Track at " . PORTAL_URL;
            break;
            
        case 'appointment':
            $message = "Appointment confirmed! Date: " . $data['date'] . ", Time: " . $data['time'] . ", Location: " . $data['location'] . ". Bring ID proof and Application ID: " . $data['application_id'];
            break;
            
        case 'appointment_reminder':
            $message = "Reminder: You have an appointment tomorrow at " . $data['time'] . " at " . $data['location'] . ". Please arrive 15 minutes early with required documents.";
            break;
            
        case 'document_required':
            $message = "Action Required: Please upload " . $data['document_type'] . " for your application (ID: " . $data['application_id'] . "). Upload at " . PORTAL_URL . "upload_documents.html";
            break;
            
        case 'otp':
            $message = "Your OTP for " . PORTAL_NAME . " is: " . $data['otp'] . ". Valid for 10 minutes. Do not share this OTP with anyone.";
            break;
            
        default:
            $message = isset($data['message']) ? $data['message'] : 'Notification from ' . PORTAL_NAME;
    }
    
    // SMS character limit (160 for single SMS)
    if (strlen($message) > 160) {
        $message = substr($message, 0, 157) . '...';
    }
    
    return $message;
}

/**
 * Send SMS via Fast2SMS
 */
function sendViaFast2SMS($phone, $message) {
    $url = SMS_API_URL;
    
    $data = [
        'authorization' => SMS_API_KEY,
        'sender_id' => SMS_SENDER_ID,
        'message' => $message,
        'route' => 'v3',
        'numbers' => $phone
    ];
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    
    if ($err) {
        if (LOG_NOTIFICATIONS) {
            error_log(date('[Y-m-d H:i:s] ') . "SMS Error: $err" . PHP_EOL, 3, NOTIFICATION_LOG_FILE);
        }
        return ['success' => false, 'message' => $err];
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['return']) && $result['return'] == true) {
        return ['success' => true, 'message' => 'SMS sent successfully'];
    } else {
        $errorMsg = isset($result['message']) ? $result['message'] : 'Unknown error';
        return ['success' => false, 'message' => $errorMsg];
    }
}

/**
 * Send SMS via Twilio (Alternative)
 */
function sendViaTwilio($phone, $message) {
    // Requires Twilio PHP SDK: composer require twilio/sdk
    // require_once 'vendor/autoload.php';
    // use Twilio\Rest\Client;
    
    try {
        // $client = new Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        // $message = $client->messages->create(
        //     '+91' . $phone,
        //     [
        //         'from' => TWILIO_PHONE_NUMBER,
        //         'body' => $message
        //     ]
        // );
        // return ['success' => true, 'message' => 'SMS sent successfully'];
        
        return ['success' => false, 'message' => 'Twilio not configured'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => $e->getMessage()];
    }
}

/**
 * Send SMS via MSG91 (Alternative)
 */
function sendViaMSG91($phone, $message) {
    $url = "https://api.msg91.com/api/v5/flow/";
    
    $data = [
        'authkey' => MSG91_AUTH_KEY,
        'mobiles' => '91' . $phone,
        'message' => $message,
        'sender' => MSG91_SENDER_ID,
        'route' => MSG91_ROUTE,
        'country' => '91'
    ];
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/x-www-form-urlencoded"
        ],
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    
    if ($err) {
        return ['success' => false, 'message' => $err];
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['type']) && $result['type'] == 'success') {
        return ['success' => true, 'message' => 'SMS sent successfully'];
    } else {
        $errorMsg = isset($result['message']) ? $result['message'] : 'Unknown error';
        return ['success' => false, 'message' => $errorMsg];
    }
}
