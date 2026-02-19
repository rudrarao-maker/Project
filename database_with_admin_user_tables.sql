-- Enhanced Database Schema with Separate Admin and User Tables
-- Drop existing database and create fresh
DROP DATABASE IF EXISTS gov_eservices_database;
CREATE DATABASE gov_eservices_database;
USE gov_eservices_database;

-- Drop existing tables
DROP TABLE IF EXISTS user_saved_schemes;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS service_applications;
DROP TABLE IF EXISTS document_uploads;
DROP TABLE IF EXISTS schemes;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- ADMINS TABLE - For administrative users
-- ============================================================================
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'officer', 'reviewer') DEFAULT 'admin',
    department VARCHAR(100),
    designation VARCHAR(100),
    permissions JSON,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- USERS TABLE - For citizen users
-- ============================================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(12) UNIQUE,
    pan_number VARCHAR(10),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    pincode VARCHAR(6),
    password VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended', 'pending_verification') DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_mobile (mobile),
    INDEX idx_aadhaar (aadhaar_number),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    department VARCHAR(100),
    required_documents TEXT,
    processing_time VARCHAR(50),
    fees DECIMAL(10,2) DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_code (service_code),
    INDEX idx_category (category),
    INDEX idx_status (status),
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SERVICE APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE service_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'in_progress', 'approved', 'rejected', 'on_hold') DEFAULT 'pending',
    submitted_data JSON,
    remarks TEXT,
    assigned_to INT,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_service_id (service_id),
    INDEX idx_application_number (application_number),
    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SCHEMES TABLE
-- ============================================================================
CREATE TABLE schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    eligibility TEXT,
    benefits TEXT,
    state VARCHAR(50),
    department VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_scheme_code (scheme_code),
    INDEX idx_category (category),
    INDEX idx_state (state),
    INDEX idx_status (status),
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- USER SAVED SCHEMES TABLE
-- ============================================================================
CREATE TABLE user_saved_schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    scheme_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_scheme (user_id, scheme_id),
    INDEX idx_user_id (user_id),
    INDEX idx_scheme_id (scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    admin_id INT,
    recipient_type ENUM('user', 'admin') NOT NULL,
    type ENUM('email', 'sms', 'in_app') NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'read') DEFAULT 'pending',
    error_message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_recipient_type (recipient_type),
    INDEX idx_type (type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOCUMENT UPLOADS TABLE
-- ============================================================================
CREATE TABLE document_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    application_id VARCHAR(50),
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_remarks TEXT,
    reviewed_by INT,
    reviewed_at TIMESTAMP NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_application_id (application_id),
    INDEX idx_reviewed_by (reviewed_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ADMIN ACTIVITY LOG TABLE
-- ============================================================================
CREATE TABLE admin_activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert Sample Admins
INSERT INTO admins (admin_id, name, email, mobile, password, role, department, designation, status) VALUES
('ADM001', 'Super Admin', 'superadmin@gov.in', '9999999999', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'IT Department', 'System Administrator', 'active'),
('ADM002', 'Admin User', 'admin@gov.in', '9999999998', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'General Administration', 'Admin Officer', 'active'),
('ADM003', 'Document Reviewer', 'reviewer@gov.in', '9999999997', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'reviewer', 'Document Verification', 'Senior Officer', 'active');

-- Insert Sample Users
INSERT INTO users (user_id, name, email, mobile, aadhaar_number, password, status, email_verified, mobile_verified) VALUES
('USR001', 'Test User', 'test@example.com', '9876543210', '123456789012', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', TRUE, TRUE),
('USR002', 'John Doe', 'john@example.com', '9876543211', '123456789013', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', TRUE, FALSE),
('USR003', 'Jane Smith', 'jane@example.com', '9876543212', '123456789014', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending_verification', FALSE, FALSE);

-- Insert Services (same as before)
INSERT INTO services (service_code, name, description, category, department, required_documents, processing_time, fees, created_by) VALUES
('SRV001', 'Aadhaar Card', 'Apply for new Aadhaar or update existing details', 'Identity', 'UIDAI', 'Proof of Identity, Proof of Address', '30 days', 0, 1),
('SRV002', 'PAN Card', 'Apply for Permanent Account Number', 'Identity', 'Income Tax Department', 'Proof of Identity, Proof of Address, Photo', '15 days', 110, 1),
('SRV003', 'Voter ID Card', 'Electoral Photo Identity Card', 'Identity', 'Election Commission', 'Proof of Identity, Proof of Address, Photo', '30 days', 0, 1),
('SRV004', 'Passport', 'Apply for Indian Passport', 'Identity', 'Ministry of External Affairs', 'Birth Certificate, Address Proof, Photo', '30-45 days', 1500, 1),
('SRV005', 'Driving License', 'Apply for Driving License', 'Transport', 'RTO', 'Age Proof, Address Proof, Medical Certificate', '30 days', 200, 1);

-- Insert Schemes (same as before with scheme codes)
INSERT INTO schemes (scheme_code, name, description, category, eligibility, benefits, state, department, created_by) VALUES
('SCH001', 'PM-KISAN', 'Pradhan Mantri Kisan Samman Nidhi', 'Agriculture', 'Small and marginal farmers', '₹6000 per year', 'Central', 'Ministry of Agriculture', 1),
('SCH002', 'Ayushman Bharat', 'Pradhan Mantri Jan Arogya Yojana', 'Health', 'Poor and vulnerable families', '₹5 lakh health cover', 'Central', 'Ministry of Health', 1),
('SCH003', 'PM Awas Yojana', 'Housing for All', 'Housing', 'EWS and LIG', 'Subsidy on home loans', 'Central', 'Ministry of Housing', 1);

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER //

-- Procedure to create application
CREATE PROCEDURE create_application(
    IN p_user_id INT,
    IN p_service_id INT,
    IN p_data JSON
)
BEGIN
    DECLARE app_number VARCHAR(50);
    SET app_number = CONCAT('APP', YEAR(NOW()), LPAD(FLOOR(RAND() * 999999), 6, '0'));
    
    INSERT INTO service_applications (user_id, service_id, application_number, submitted_data)
    VALUES (p_user_id, p_service_id, app_number, p_data);
    
    SELECT app_number AS application_number;
END //

-- Procedure to log admin activity
CREATE PROCEDURE log_admin_activity(
    IN p_admin_id INT,
    IN p_action VARCHAR(100),
    IN p_target_type VARCHAR(50),
    IN p_target_id INT,
    IN p_description TEXT,
    IN p_ip_address VARCHAR(45)
)
BEGIN
    INSERT INTO admin_activity_log (admin_id, action, target_type, target_id, description, ip_address)
    VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_description, p_ip_address);
END //

DELIMITER ;

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

-- View for admin dashboard statistics
CREATE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
    (SELECT COUNT(*) FROM service_applications WHERE status = 'pending') as pending_applications,
    (SELECT COUNT(*) FROM document_uploads WHERE status = 'pending') as pending_documents,
    (SELECT COUNT(*) FROM services WHERE status = 'active') as active_services,
    (SELECT COUNT(*) FROM schemes WHERE status = 'active') as active_schemes;

-- View for user application summary
CREATE VIEW user_application_summary AS
SELECT 
    u.id as user_id,
    u.user_id as user_code,
    u.name as user_name,
    u.email,
    COUNT(sa.id) as total_applications,
    SUM(CASE WHEN sa.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
    SUM(CASE WHEN sa.status = 'approved' THEN 1 ELSE 0 END) as approved_count,
    SUM(CASE WHEN sa.status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
FROM users u
LEFT JOIN service_applications sa ON u.id = sa.user_id
GROUP BY u.id, u.user_id, u.name, u.email;

