# Gov E-Services Portal

A comprehensive government e-services portal built to provide citizens with easy access to various government services, schemes, and applications.

## 🌟 Features

### User Features
- **All Services Portal** - Access 500+ government services in one place
- **Schemes & Scholarships** - Browse and apply for government schemes
- **Document Upload & Verification** - Upload and track document verification status
- **Application Tracking** - Real-time tracking of application status
- **Payment Gateway** - Secure online payment for government services
- **Office Locator** - Find nearby government offices with Google Maps integration
- **Jobs & Recruitment** - Browse government job opportunities

### Admin Features
- **Admin Dashboard** - Analytics and statistics overview
- **Document Review System** - Approve/reject uploaded documents
- **Notification Management** - Send email and SMS notifications
- **User Management** - Manage user accounts and permissions

### Design Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Modern UI** - Clean, government portal themed interface
- **Smooth Animations** - Professional transitions and effects
- **Hero Slider** - Dynamic homepage slider with Swiper.js

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: PHP
- **Database**: MySQL
- **Libraries**: 
  - Swiper.js (Hero Slider)
  - Font Awesome (Icons)
  - Google Fonts (Poppins, Inter)
  - Chart.js (Admin Analytics)

## 📋 Prerequisites

- XAMPP (or any PHP server with MySQL)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Modern web browser

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gov-e-services-portal.git
   ```

2. **Move to XAMPP htdocs**
   ```bash
   # Copy the project folder to C:\xampp\htdocs\
   ```

3. **Import Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database (e.g., `gov_services`)
   - Import `database_import.sql`

4. **Configure Database Connection**
   - Open `api/config.php`
   - Update database credentials:
     ```php
     $host = 'localhost';
     $dbname = 'gov_services';
     $username = 'root';
     $password = '';
     ```

5. **Start XAMPP**
   - Start Apache and MySQL services
   - Open browser and navigate to `http://localhost/gov-e-services-portal/Main.html`

## 📁 Project Structure

```
gov-e-services-portal/
├── Main.html                    # Homepage
├── login.html                   # User login
├── signup.html                  # User registration
├── user_dashboard.html          # User dashboard
├── admin_panel.html             # Admin dashboard
├── all_services.html            # All services page
├── all_schemes.html             # Schemes & scholarships
├── jobs_recruitment.html        # Jobs portal
├── upload_documents.html        # Document upload
├── application_tracking.html    # Track applications
├── payment_gateway.html         # Payment gateway
├── office_locator.html          # Office locator
├── contact.html                 # Contact page
├── developers.html              # Team page
├── document_review_admin.html   # Admin document review
├── notifications_admin.html     # Admin notifications
├── api/                         # Backend PHP files
│   ├── config.php              # Database configuration
│   ├── login_handler.php       # Login logic
│   ├── signup_handler.php      # Registration logic
│   ├── upload_document.php     # Document upload
│   ├── email_handler.php       # Email notifications
│   ├── sms_handler.php         # SMS notifications
│   └── ...                     # Other API files
├── img/                         # Images and assets
│   ├── team/                   # Team member photos
│   ├── slider/                 # Hero slider images
│   └── states/                 # State map images
├── uploads/                     # User uploaded documents
└── database_import.sql          # Database schema

```

## 🎨 Key Pages

1. **Homepage (Main.html)** - Hero slider, services overview, quick access
2. **All Services** - Comprehensive list of 44+ government services
3. **User Dashboard** - Personal dashboard with statistics and quick actions
4. **Admin Panel** - Analytics dashboard with charts and statistics
5. **Document Upload** - Upload and verify documents with real-time preview
6. **Office Locator** - Find nearby government offices with Google Maps

## 👥 Team

This project was developed by a 3-member team:
- Team Member 1 - Full Stack Developer
- Team Member 2 - Frontend Developer & Designer
- Team Member 3 - Backend Developer & Database Specialist

## 🔐 Security Features

- Password hashing for user accounts
- SQL injection prevention
- XSS protection
- File upload validation
- Session management

## 📱 Responsive Design

The portal is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1366px - 1920px)
- Tablet (768px - 1366px)
- Mobile (320px - 768px)

## 🌙 Dark Mode

Toggle between light and dark themes using the floating button in the bottom-right corner. Theme preference is saved in localStorage.

## 📧 Contact

For any queries or support, please contact:
- Email: 24172012074@gnu.ac.in

## 📄 License

This project is developed for educational purposes.

## 🙏 Acknowledgments

- Government of India for design inspiration
- Tailwind CSS for the utility-first CSS framework
- Font Awesome for icons
- Swiper.js for the hero slider

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, SSL certificates, and compliance with government standards.
