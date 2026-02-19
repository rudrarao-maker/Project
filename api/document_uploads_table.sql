-- Document Uploads Table for Admin Review System
-- Run this SQL in phpMyAdmin to create the table

CREATE TABLE IF NOT EXISTS `document_uploads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `application_id` VARCHAR(50) DEFAULT NULL,
  `document_type` VARCHAR(100) NOT NULL,
  `document_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` INT NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `admin_remarks` TEXT DEFAULT NULL,
  `reviewed_by` INT DEFAULT NULL,
  `reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (`user_id`),
  INDEX idx_status (`status`),
  INDEX idx_application_id (`application_id`),
  INDEX idx_uploaded_at (`uploaded_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing (optional)
-- INSERT INTO `document_uploads` (`user_id`, `application_id`, `document_type`, `document_name`, `file_path`, `file_size`, `file_type`, `status`) VALUES
-- (1, 'APP2026123456', 'Aadhaar Card', 'aadhaar_front.jpg', 'uploads/documents/aadhaar_front.jpg', 245678, 'image/jpeg', 'pending'),
-- (1, 'APP2026123456', 'PAN Card', 'pan_card.pdf', 'uploads/documents/pan_card.pdf', 156789, 'application/pdf', 'pending'),
-- (2, 'APP2026123457', 'Voter ID', 'voter_id.jpg', 'uploads/documents/voter_id.jpg', 198765, 'image/jpeg', 'approved'),
-- (3, NULL, 'Passport', 'passport.pdf', 'uploads/documents/passport.pdf', 567890, 'application/pdf', 'rejected');
