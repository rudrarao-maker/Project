-- Drop existing database and create fresh
DROP DATABASE IF EXISTS gov_eservices_database;
CREATE DATABASE gov_eservices_database;
USE gov_eservices_database;

-- Users Table
DROP TABLE IF EXISTS user_saved_schemes;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS service_applications;
DROP TABLE IF EXISTS schemes;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    aadhaar_number VARCHAR(12),
    password VARCHAR(255) NOT NULL,
    role ENUM('citizen', 'admin', 'officer') DEFAULT 'citizen',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    department VARCHAR(100),
    required_documents TEXT,
    processing_time VARCHAR(50),
    fees DECIMAL(10,2) DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Applications Table
CREATE TABLE service_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'in_progress', 'approved', 'rejected') DEFAULT 'pending',
    submitted_data JSON,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Schemes Table
CREATE TABLE schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    eligibility TEXT,
    benefits TEXT,
    state VARCHAR(50),
    department VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Saved Schemes Table
CREATE TABLE user_saved_schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    scheme_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_scheme (user_id, scheme_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Test Users
INSERT INTO users (name, email, mobile, aadhaar_number, password, role) VALUES
('Admin User', 'admin@gov.in', '9999999999', '123456789012', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Test User', 'test@example.com', '9876543210', '987654321098', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'citizen');

-- Insert Services
INSERT INTO services (name, description, category, department, required_documents, processing_time, fees) VALUES
('Aadhaar Card', 'Apply for new Aadhaar or update existing details', 'Identity', 'UIDAI', 'Proof of Identity, Proof of Address', '30 days', 0),
('PAN Card', 'Apply for Permanent Account Number', 'Identity', 'Income Tax Department', 'Proof of Identity, Proof of Address, Photo', '15 days', 110),
('Voter ID Card', 'Electoral Photo Identity Card', 'Identity', 'Election Commission', 'Proof of Identity, Proof of Address, Photo', '30 days', 0),
('Passport', 'Apply for Indian Passport', 'Identity', 'Ministry of External Affairs', 'Birth Certificate, Address Proof, Photo', '30-45 days', 1500),
('Driving License', 'Apply for Driving License', 'Transport', 'RTO', 'Age Proof, Address Proof, Medical Certificate', '30 days', 200),
('Birth Certificate', 'Register birth and get certificate', 'Certificate', 'Municipal Corporation', 'Hospital Certificate, Parents ID', '7 days', 50),
('Death Certificate', 'Register death and get certificate', 'Certificate', 'Municipal Corporation', 'Hospital Certificate, ID Proof', '7 days', 50),
('Ration Card', 'Apply for Ration Card', 'Welfare', 'Food & Civil Supplies', 'Address Proof, Income Certificate, Photo', '30 days', 0),
('Income Certificate', 'Get Income Certificate', 'Certificate', 'Revenue Department', 'Salary Slip, Bank Statement, Aadhaar', '15 days', 30),
('Caste Certificate', 'Get Caste Certificate', 'Certificate', 'Revenue Department', 'School Certificate, Aadhaar, Photo', '30 days', 30),
('Domicile Certificate', 'Get Domicile Certificate', 'Certificate', 'Revenue Department', 'Address Proof, Aadhaar, Photo', '15 days', 30),
('Marriage Certificate', 'Register marriage and get certificate', 'Certificate', 'Municipal Corporation', 'Marriage Invitation, Photos, ID Proof', '30 days', 100);

-- Insert Central Government Schemes
INSERT INTO schemes (name, description, category, eligibility, benefits, state, department) VALUES
('PM-KISAN', 'Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers', 'Agriculture', 'Small and marginal farmers', '₹6000 per year in 3 installments', 'Central', 'Ministry of Agriculture'),
('Ayushman Bharat', 'Pradhan Mantri Jan Arogya Yojana - Health insurance scheme', 'Health', 'Poor and vulnerable families', 'Health cover of ₹5 lakh per family per year', 'Central', 'Ministry of Health'),
('PM Awas Yojana', 'Housing for All - Affordable housing scheme', 'Housing', 'Economically Weaker Section and Low Income Group', 'Subsidy on home loans', 'Central', 'Ministry of Housing'),
('Sukanya Samriddhi Yojana', 'Small savings scheme for girl child', 'Social Welfare', 'Girl child below 10 years', 'High interest rate, tax benefits', 'Central', 'Ministry of Finance'),
('Atal Pension Yojana', 'Pension scheme for unorganized sector', 'Pension', 'Citizens aged 18-40 years', 'Guaranteed pension of ₹1000-5000', 'Central', 'Ministry of Finance'),
('PM Mudra Yojana', 'Micro Units Development Refinance Agency - Loans for small businesses', 'Finance', 'Small business owners', 'Loans up to ₹10 lakh', 'Central', 'Ministry of Finance'),
('Beti Bachao Beti Padhao', 'Save and educate girl child', 'Social Welfare', 'Girl child', 'Awareness and education support', 'Central', 'Ministry of Women and Child Development'),
('National Scholarship Portal', 'Scholarships for students', 'Education', 'Students from various categories', 'Financial assistance for education', 'Central', 'Ministry of Education');

-- Insert State-Specific Schemes
INSERT INTO schemes (name, description, category, eligibility, benefits, state, department) VALUES
-- Maharashtra
('Mahatma Jyotiba Phule Jan Arogya Yojana', 'Health insurance for families below poverty line', 'Health', 'BPL families in Maharashtra', 'Free treatment up to ₹1.5 lakh', 'Maharashtra', 'Health Department'),
('Maharashtra Farmers Loan Waiver', 'Farm loan waiver scheme', 'Agriculture', 'Farmers with crop loans', 'Loan waiver up to ₹1.5 lakh', 'Maharashtra', 'Agriculture Department'),

-- Karnataka
('Krishi Bhagya Scheme', 'Irrigation support for farmers', 'Agriculture', 'Farmers in Karnataka', 'Subsidy on irrigation equipment', 'Karnataka', 'Agriculture Department'),
('Ksheera Bhagya Scheme', 'Free milk for school children', 'Education', 'Government school students', 'Free milk 5 days a week', 'Karnataka', 'Education Department'),

-- Tamil Nadu
('Amma Unavagam', 'Subsidized food scheme', 'Food Security', 'All citizens', 'Meals at ₹5-20', 'Tamil Nadu', 'Food Department'),
('Free Laptop Scheme', 'Free laptops for students', 'Education', 'Government school students in class 11', 'Free laptop', 'Tamil Nadu', 'Education Department'),

-- Uttar Pradesh
('Kanya Sumangala Yojana', 'Financial assistance for girl child', 'Social Welfare', 'Girl child in UP', '₹15000 in installments', 'Uttar Pradesh', 'Women Welfare Department'),
('UP Free Laptop Scheme', 'Free laptops for meritorious students', 'Education', '10th and 12th pass students', 'Free laptop', 'Uttar Pradesh', 'Education Department'),

-- Gujarat
('Vahli Dikri Yojana', 'Financial assistance for girl child education', 'Education', 'Girl child in Gujarat', '₹1 lakh on 18th birthday', 'Gujarat', 'Women and Child Development'),
('Mukhyamantri Yuva Swavalamban Yojana', 'Skill development for youth', 'Skill Development', 'Youth aged 18-35', 'Free training and stipend', 'Gujarat', 'Skill Development Department'),

-- Rajasthan
('Bhamashah Yojana', 'Financial inclusion and empowerment', 'Social Welfare', 'Women in Rajasthan', 'Direct benefit transfer', 'Rajasthan', 'Social Justice Department'),
('Indira Rasoi Yojana', 'Subsidized meals', 'Food Security', 'All citizens', 'Meals at ₹8', 'Rajasthan', 'Food Department');

-- Create Stored Procedure for Application Submission
DELIMITER //
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
DELIMITER ;
