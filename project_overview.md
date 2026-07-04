# Government e-Services Portal - Project Overview

## 📖 Introduction
The **Government e-Services Portal** is a modern, full-stack web application designed to bridge the gap between citizens and government administration. It provides a centralized, highly responsive platform for citizens to access welfare schemes, government services, news, and document management, while equipping administrators with powerful tools to manage users, tasks, and applications.

---

## 🚀 Tech Stack
### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Custom CSS (with some Tailwind utility integration), Glassmorphism design principles
- **Animations:** Framer Motion for smooth, premium page transitions and interactive elements
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js with Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL (`gov_eservices` database)
- **Architecture:** MVC Pattern (Routes -> Controllers -> Prisma Models)

---

## ✨ Core Features & Modules

### 1. Unified Citizen Dashboard (User Portal)
- **Dynamic Homepage:** Features an auto-updating hero slider pulling live banners from official government sources, a grid of integrated video tutorials, and a live news feed.
- **Service & Scheme Discovery:** Users can search and filter through numerous government services (e.g., PAN Card, Aadhaar updates) and welfare schemes.
- **File Manager (formerly Digital Locker):** A secure space for citizens to upload and manage their personal identity documents and application files.
- **Tasks Dashboard:** Users receive direct tasks from administrators (e.g., "Upload missing document") and can mark them as complete.

### 2. Comprehensive Admin Control Panel
- **Role-Based Access Control:** Secure routes ensuring only verified administrators can access the backend management tools.
- **Admin File Manager:** A centralized view allowing admins to browse, search, and verify documents uploaded by users system-wide.
- **Task Management System:** A Kanban-style dashboard for admins to create tasks, assign them to specific users (via User IDs), and track their completion status.
- **Application & User Management:** Dedicated interfaces for admins to view, approve, or reject citizen applications, and manage registered user accounts.

### 3. UI/UX Enhancements
- **Premium Aesthetics:** Implementation of a sleek, dark-mode compatible UI featuring glassmorphism (frosted glass effects), glowing accents, and smooth hover micro-animations.
- **Video Guides Integration:** Direct YouTube embeds for step-by-step tutorials on using government services, improving digital literacy and user onboarding.

---

## 🗄️ Database Schema Highlights (Prisma)
The database serves as the single source of truth, relying on robust relational mapping:
- **`User` / `Admin` Models:** Manages authentication, roles, and profiles.
- **`Task` Model:** Links Admins (creators) and Users (assignees) with fields for title, description, status (`PENDING`, `COMPLETED`), and timestamps.
- **`Service` / `Scheme` / `News` Models:** Data structures to feed the citizen-facing informational pages.

---

## 🔮 Future Roadmap (Phase 8 Pending)
- **Authentication:** Implement secure JWT-based authentication with Email/OTP verification.
- **Analytics:** Build a comprehensive data analytics dashboard for administrators to track portal usage.
- **Performance & SEO:** Optimize assets and implement strict accessibility standards (ARIA labels).
- **Testing & Deployment:** Add automated unit/integration tests and establish CI/CD pipelines (e.g., GitHub Actions) for cloud deployment.
