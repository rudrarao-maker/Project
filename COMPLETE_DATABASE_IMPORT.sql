-- ============================================================================
-- COMPLETE DATABASE IMPORT SCRIPT
-- Gov E-Services Portal - Full Database Setup
-- ============================================================================
-- 
-- This script imports all database tables and data in the correct order
-- Run this file in phpMyAdmin or MySQL command line
-- 
-- INSTRUCTIONS:
-- 1. Open phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Click "Import" tab
-- 3. Choose this file (COMPLETE_DATABASE_IMPORT.sql)
-- 4. Click "Go" button
-- 
-- OR use MySQL command line:
-- mysql -u root -p < COMPLETE_DATABASE_IMPORT.sql
-- 
-- ============================================================================

-- Drop existing database and create fresh
DROP DATABASE IF EXISTS gov_eservices_database;
CREATE DATABASE gov_eservices_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gov_eservices_database;

-- ============================================================================
-- PART 1: CORE TABLES (Admin and User Management)
-- ============================================================================

-- ADMINS TABLE
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

-- USERS TABLE
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
-- PART 2: SERVICE AND SCHEME TABLES
-- ============================================================================

-- SERVICES TABLE
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

-- SERVICE APPLICATIONS TABLE
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

-- SCHEMES TABLE
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

-- USER SAVED SCHEMES TABLE
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
-- PART 3: NOTIFICATION AND DOCUMENT TABLES
-- ============================================================================

-- NOTIFICATIONS TABLE
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

-- DOCUMENT UPLOADS TABLE
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
-- PART 4: ADMIN ACTIVITY LOG
-- ============================================================================

-- ADMIN ACTIVITY LOG TABLE
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
-- PART 5: SAMPLE DATA
-- ============================================================================

-- Insert Sample Admins (password: password)
INSERT INTO admins (admin_id, name, email, mobile, password, role, department, designation, status) VALUES
('ADM001', 'Super Admin', 'superadmin@gov.in', '9999999999', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'IT Department', 'System Administrator', 'active'),
('ADM002', 'Admin User', 'admin@gov.in', '9999999998', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'General Administration', 'Admin Officer', 'active'),
('ADM003', 'Document Reviewer', 'reviewer@gov.in', '9999999997', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'reviewer', 'Document Verification', 'Senior Officer', 'active');

-- Insert Sample Users (password: password)
INSERT INTO users (user_id, name, email, mobile, aadhaar_number, password, status, email_verified, mobile_verified) VALUES
('USR001', 'Test User', 'test@example.com', '9876543210', '123456789012', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', TRUE, TRUE),
('USR002', 'John Doe', 'john@example.com', '9876543211', '123456789013', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', TRUE, FALSE),
('USR003', 'Jane Smith', 'jane@example.com', '9876543212', '123456789014', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending_verification', FALSE, FALSE);

-- Insert Services
INSERT INTO services (service_code, name, description, category, department, required_documents, processing_time, fees, created_by) VALUES
('SRV001', 'Aadhaar Card', 'Apply for new Aadhaar or update existing details', 'Identity', 'UIDAI', 'Proof of Identity, Proof of Address', '30 days', 0, 1),
('SRV002', 'PAN Card', 'Apply for Permanent Account Number', 'Identity', 'Income Tax Department', 'Proof of Identity, Proof of Address, Photo', '15 days', 110, 1),
('SRV003', 'Voter ID Card', 'Electoral Photo Identity Card', 'Identity', 'Election Commission', 'Proof of Identity, Proof of Address, Photo', '30 days', 0, 1),
('SRV004', 'Passport', 'Apply for Indian Passport', 'Identity', 'Ministry of External Affairs', 'Birth Certificate, Address Proof, Photo', '30-45 days', 1500, 1),
('SRV005', 'Driving License', 'Apply for Driving License', 'Transport', 'RTO', 'Age Proof, Address Proof, Medical Certificate', '30 days', 200, 1),
('SRV006', 'Birth Certificate', 'Register birth and get certificate', 'Certificate', 'Municipal Corporation', 'Hospital Certificate, Parents ID', '7 days', 50, 1),
('SRV007', 'Death Certificate', 'Register death and get certificate', 'Certificate', 'Municipal Corporation', 'Hospital Certificate, ID Proof', '7 days', 50, 1),
('SRV008', 'Ration Card', 'Apply for Ration Card', 'Welfare', 'Food & Civil Supplies', 'Address Proof, Income Certificate, Photo', '30 days', 0, 1),
('SRV009', 'Income Certificate', 'Get Income Certificate', 'Certificate', 'Revenue Department', 'Salary Slip, Bank Statement, Aadhaar', '15 days', 30, 1),
('SRV010', 'Caste Certificate', 'Get Caste Certificate', 'Certificate', 'Revenue Department', 'School Certificate, Aadhaar, Photo', '30 days', 30, 1),
('SRV011', 'Domicile Certificate', 'Get Domicile Certificate', 'Certificate', 'Revenue Department', 'Address Proof, Aadhaar, Photo', '15 days', 30, 1),
('SRV012', 'Marriage Certificate', 'Register marriage and get certificate', 'Certificate', 'Municipal Corporation', 'Marriage Invitation, Photos, ID Proof', '30 days', 100, 1);

-- Insert Central Government Schemes
INSERT INTO schemes (scheme_code, name, description, category, eligibility, benefits, state, department, created_by) VALUES
('SCH001', 'PM-KISAN', 'Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers', 'Agriculture', 'Small and marginal farmers', '₹6000 per year in 3 installments', 'Central', 'Ministry of Agriculture', 1),
('SCH002', 'Ayushman Bharat', 'Pradhan Mantri Jan Arogya Yojana - Health insurance scheme', 'Health', 'Poor and vulnerable families', 'Health cover of ₹5 lakh per family per year', 'Central', 'Ministry of Health', 1),
('SCH003', 'PM Awas Yojana', 'Housing for All - Affordable housing scheme', 'Housing', 'Economically Weaker Section and Low Income Group', 'Subsidy on home loans', 'Central', 'Ministry of Housing', 1),
('SCH004', 'Sukanya Samriddhi Yojana', 'Small savings scheme for girl child', 'Social Welfare', 'Girl child below 10 years', 'High interest rate, tax benefits', 'Central', 'Ministry of Finance', 1),
('SCH005', 'Atal Pension Yojana', 'Pension scheme for unorganized sector', 'Pension', 'Citizens aged 18-40 years', 'Guaranteed pension of ₹1000-5000', 'Central', 'Ministry of Finance', 1),
('SCH006', 'PM Mudra Yojana', 'Micro Units Development Refinance Agency - Loans for small businesses', 'Finance', 'Small business owners', 'Loans up to ₹10 lakh', 'Central', 'Ministry of Finance', 1),
('SCH007', 'Beti Bachao Beti Padhao', 'Save and educate girl child', 'Social Welfare', 'Girl child', 'Awareness and education support', 'Central', 'Ministry of Women and Child Development', 1),
('SCH008', 'National Scholarship Portal', 'Scholarships for students', 'Education', 'Students from various categories', 'Financial assistance for education', 'Central', 'Ministry of Education', 1);

-- Insert State-Specific Schemes
INSERT INTO schemes (scheme_code, name, description, category, eligibility, benefits, state, department, created_by) VALUES
('SCH009', 'Mahatma Jyotiba Phule Jan Arogya Yojana', 'Health insurance for families below poverty line', 'Health', 'BPL families in Maharashtra', 'Free treatment up to ₹1.5 lakh', 'Maharashtra', 'Health Department', 1),
('SCH010', 'Maharashtra Farmers Loan Waiver', 'Farm loan waiver scheme', 'Agriculture', 'Farmers with crop loans', 'Loan waiver up to ₹1.5 lakh', 'Maharashtra', 'Agriculture Department', 1),
('SCH011', 'Krishi Bhagya Scheme', 'Irrigation support for farmers', 'Agriculture', 'Farmers in Karnataka', 'Subsidy on irrigation equipment', 'Karnataka', 'Agriculture Department', 1),
('SCH012', 'Ksheera Bhagya Scheme', 'Free milk for school children', 'Education', 'Government school students', 'Free milk 5 days a week', 'Karnataka', 'Education Department', 1),
('SCH013', 'Amma Unavagam', 'Subsidized food scheme', 'Food Security', 'All citizens', 'Meals at ₹5-20', 'Tamil Nadu', 'Food Department', 1),
('SCH014', 'Free Laptop Scheme', 'Free laptops for students', 'Education', 'Government school students in class 11', 'Free laptop', 'Tamil Nadu', 'Education Department', 1),
('SCH015', 'Kanya Sumangala Yojana', 'Financial assistance for girl child', 'Social Welfare', 'Girl child in UP', '₹15000 in installments', 'Uttar Pradesh', 'Women Welfare Department', 1),
('SCH016', 'UP Free Laptop Scheme', 'Free laptops for meritorious students', 'Education', '10th and 12th pass students', 'Free laptop', 'Uttar Pradesh', 'Education Department', 1),
('SCH017', 'Vahli Dikri Yojana', 'Financial assistance for girl child education', 'Education', 'Girl child in Gujarat', '₹1 lakh on 18th birthday', 'Gujarat', 'Women and Child Development', 1),
('SCH018', 'Mukhyamantri Yuva Swavalamban Yojana', 'Skill development for youth', 'Skill Development', 'Youth aged 18-35', 'Free training and stipend', 'Gujarat', 'Skill Development Department', 1),
('SCH019', 'Bhamashah Yojana', 'Financial inclusion and empowerment', 'Social Welfare', 'Women in Rajasthan', 'Direct benefit transfer', 'Rajasthan', 'Social Justice Department', 1),
('SCH020', 'Indira Rasoi Yojana', 'Subsidized meals', 'Food Security', 'All citizens', 'Meals at ₹8', 'Rajasthan', 'Food Department', 1);

-- ============================================================================
-- PART 6: STORED PROCEDURES
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
-- PART 7: DATABASE VIEWS
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

-- ============================================================================
-- DATABASE IMPORT COMPLETED SUCCESSFULLY!
-- ============================================================================
-- 
-- SUMMARY:
-- - 9 Tables Created
-- - 2 Stored Procedures Created
-- - 2 Views Created
-- - Sample Data Inserted:
--   * 3 Admins
--   * 3 Users
--   * 12 Services
--   * 20 Schemes
-- 
-- DEFAULT LOGIN CREDENTIALS:
-- 
-- ADMIN LOGIN:
-- Email: admin@gov.in
-- Password: password
-- 
-- USER LOGIN:
-- Email: test@example.com
-- Password: password
-- 
-- NEXT STEPS:
-- 1. Update api/config.php with database credentials
-- 2. Test login functionality
-- 3. Change default passwords for security
-- 
-- ============================================================================
