-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'admin', 'officer', 'reviewer');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SchemeStatus" AS ENUM ('active', 'inactive', 'expired');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('draft', 'pending', 'in_progress', 'document_verification', 'payment_pending', 'payment_completed', 'approved', 'rejected', 'on_hold', 'correction_required', 'completed');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'success', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('upi', 'credit_card', 'debit_card', 'net_banking', 'wallet');

-- CreateEnum
CREATE TYPE "ApplicationPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('email', 'sms', 'in_app');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'failed', 'read');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('new', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('open', 'in_progress', 'escalated', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "GrievancePriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('email_verification', 'mobile_verification', 'password_reset');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'withdrawal', 'payment', 'refund');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('identity', 'address', 'income', 'educational', 'medical', 'other');

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "admin_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mobile" VARCHAR(15) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "department" VARCHAR(100),
    "designation" VARCHAR(100),
    "permissions" JSONB,
    "two_factor_secret" VARCHAR(100),
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "status" "AdminStatus" NOT NULL DEFAULT 'active',
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mobile" VARCHAR(15) NOT NULL,
    "aadhaar_number" VARCHAR(12),
    "pan_number" VARCHAR(10),
    "date_of_birth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(50),
    "pincode" VARCHAR(6),
    "password" VARCHAR(255) NOT NULL,
    "profile_photo" VARCHAR(255),
    "status" "UserStatus" NOT NULL DEFAULT 'pending_verification',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "mobile_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "sms_notifications" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "service_code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50),
    "department" VARCHAR(100),
    "required_documents" TEXT,
    "processing_time" VARCHAR(50),
    "fees" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "official_website" VARCHAR(255),
    "logo_url" VARCHAR(500),
    "status" "ServiceStatus" NOT NULL DEFAULT 'active',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schemes" (
    "id" SERIAL NOT NULL,
    "scheme_code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50),
    "eligibility" TEXT,
    "benefits" TEXT,
    "state" VARCHAR(50),
    "department" VARCHAR(100),
    "application_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "official_website" VARCHAR(255),
    "logo_url" VARCHAR(500),
    "start_date" DATE,
    "end_date" DATE,
    "status" "SchemeStatus" NOT NULL DEFAULT 'active',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_applications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "application_number" VARCHAR(50) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "submitted_data" JSONB,
    "remarks" TEXT,
    "assigned_to" INTEGER,
    "priority" "ApplicationPriority" NOT NULL DEFAULT 'medium',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "service_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_uploads" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "application_id" INTEGER,
    "document_type" VARCHAR(100) NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'pending',
    "admin_remarks" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "admin_id" INTEGER,
    "recipient_type" "NotificationRecipientType" NOT NULL,
    "type" "NotificationType" NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255),
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_saved_schemes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scheme_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_saved_schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(50),
    "image_url" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15),
    "subject" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'new',
    "responded_by" INTEGER,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_activity_log" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "target_type" VARCHAR(50),
    "target_id" INTEGER,
    "description" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "job_code" VARCHAR(20) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "department" VARCHAR(150) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100),
    "qualification" TEXT,
    "age_limit" VARCHAR(100),
    "deadline" DATE,
    "salary" VARCHAR(100),
    "job_type" VARCHAR(50),
    "description" TEXT,
    "official_website" VARCHAR(255),
    "logo_url" VARCHAR(500),
    "notification_pdf" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "transaction_id" VARCHAR(100) NOT NULL,
    "application_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "method" "PaymentMethod",
    "payment_date" TIMESTAMP(3),
    "receipt_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR(500) NOT NULL,
    "answer" TEXT NOT NULL,
    "category" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "email" VARCHAR(100),
    "mobile" VARCHAR(15),
    "otp_hash" VARCHAR(255) NOT NULL,
    "type" "OTPType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "application_id" INTEGER,
    "grievance_number" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(100),
    "status" "GrievanceStatus" NOT NULL DEFAULT 'open',
    "priority" "GrievancePriority" NOT NULL DEFAULT 'medium',
    "assigned_to" INTEGER,
    "resolution" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER,
    "application_id" INTEGER,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER,
    "confirmation_number" VARCHAR(50) NOT NULL,
    "appointment_date" DATE NOT NULL,
    "time_slot" VARCHAR(50) NOT NULL,
    "office_location" VARCHAR(255),
    "purpose" VARCHAR(255),
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" SERIAL NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "transaction_id" VARCHAR(100) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "balance_after" DECIMAL(12,2) NOT NULL,
    "description" VARCHAR(255),
    "status" "TransactionStatus" NOT NULL DEFAULT 'completed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_locker_items" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "issued_by" VARCHAR(150),
    "issue_date" DATE,
    "expiry_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_locker_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(50) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "admin_id" INTEGER,
    "topic" VARCHAR(200),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "sender_type" "NotificationRecipientType" NOT NULL,
    "sender_user_id" INTEGER,
    "sender_admin_id" INTEGER,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_admin_id_key" ON "admins"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_mobile_key" ON "admins"("mobile");

-- CreateIndex
CREATE INDEX "admins_admin_id_idx" ON "admins"("admin_id");

-- CreateIndex
CREATE INDEX "admins_email_idx" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_role_idx" ON "admins"("role");

-- CreateIndex
CREATE INDEX "admins_status_idx" ON "admins"("status");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_aadhaar_number_key" ON "users"("aadhaar_number");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_mobile_idx" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_aadhaar_number_idx" ON "users"("aadhaar_number");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "services_service_code_key" ON "services"("service_code");

-- CreateIndex
CREATE INDEX "services_service_code_idx" ON "services"("service_code");

-- CreateIndex
CREATE INDEX "services_category_idx" ON "services"("category");

-- CreateIndex
CREATE INDEX "services_status_idx" ON "services"("status");

-- CreateIndex
CREATE UNIQUE INDEX "schemes_scheme_code_key" ON "schemes"("scheme_code");

-- CreateIndex
CREATE INDEX "schemes_scheme_code_idx" ON "schemes"("scheme_code");

-- CreateIndex
CREATE INDEX "schemes_category_idx" ON "schemes"("category");

-- CreateIndex
CREATE INDEX "schemes_state_idx" ON "schemes"("state");

-- CreateIndex
CREATE INDEX "schemes_status_idx" ON "schemes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "service_applications_application_number_key" ON "service_applications"("application_number");

-- CreateIndex
CREATE INDEX "service_applications_user_id_idx" ON "service_applications"("user_id");

-- CreateIndex
CREATE INDEX "service_applications_service_id_idx" ON "service_applications"("service_id");

-- CreateIndex
CREATE INDEX "service_applications_application_number_idx" ON "service_applications"("application_number");

-- CreateIndex
CREATE INDEX "service_applications_status_idx" ON "service_applications"("status");

-- CreateIndex
CREATE INDEX "service_applications_assigned_to_idx" ON "service_applications"("assigned_to");

-- CreateIndex
CREATE INDEX "document_uploads_user_id_idx" ON "document_uploads"("user_id");

-- CreateIndex
CREATE INDEX "document_uploads_status_idx" ON "document_uploads"("status");

-- CreateIndex
CREATE INDEX "document_uploads_application_id_idx" ON "document_uploads"("application_id");

-- CreateIndex
CREATE INDEX "document_uploads_reviewed_by_idx" ON "document_uploads"("reviewed_by");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_admin_id_idx" ON "notifications"("admin_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_type_idx" ON "notifications"("recipient_type");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "user_saved_schemes_user_id_idx" ON "user_saved_schemes"("user_id");

-- CreateIndex
CREATE INDEX "user_saved_schemes_scheme_id_idx" ON "user_saved_schemes"("scheme_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_saved_schemes_user_id_scheme_id_key" ON "user_saved_schemes"("user_id", "scheme_id");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE INDEX "admin_activity_log_admin_id_idx" ON "admin_activity_log"("admin_id");

-- CreateIndex
CREATE INDEX "admin_activity_log_action_idx" ON "admin_activity_log"("action");

-- CreateIndex
CREATE INDEX "admin_activity_log_created_at_idx" ON "admin_activity_log"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_job_code_key" ON "jobs"("job_code");

-- CreateIndex
CREATE INDEX "jobs_state_idx" ON "jobs"("state");

-- CreateIndex
CREATE INDEX "jobs_category_idx" ON "jobs"("category");

-- CreateIndex
CREATE INDEX "jobs_is_active_idx" ON "jobs"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- CreateIndex
CREATE INDEX "payments_application_id_idx" ON "payments"("application_id");

-- CreateIndex
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "faqs"("category");

-- CreateIndex
CREATE INDEX "faqs_is_active_idx" ON "faqs"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "otp_verifications_email_idx" ON "otp_verifications"("email");

-- CreateIndex
CREATE INDEX "otp_verifications_mobile_idx" ON "otp_verifications"("mobile");

-- CreateIndex
CREATE INDEX "otp_verifications_user_id_idx" ON "otp_verifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_grievance_number_key" ON "grievances"("grievance_number");

-- CreateIndex
CREATE INDEX "grievances_user_id_idx" ON "grievances"("user_id");

-- CreateIndex
CREATE INDEX "grievances_application_id_idx" ON "grievances"("application_id");

-- CreateIndex
CREATE INDEX "grievances_status_idx" ON "grievances"("status");

-- CreateIndex
CREATE INDEX "grievances_grievance_number_idx" ON "grievances"("grievance_number");

-- CreateIndex
CREATE INDEX "feedbacks_user_id_idx" ON "feedbacks"("user_id");

-- CreateIndex
CREATE INDEX "feedbacks_service_id_idx" ON "feedbacks"("service_id");

-- CreateIndex
CREATE INDEX "feedbacks_application_id_idx" ON "feedbacks"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_confirmation_number_key" ON "appointments"("confirmation_number");

-- CreateIndex
CREATE INDEX "appointments_user_id_idx" ON "appointments"("user_id");

-- CreateIndex
CREATE INDEX "appointments_service_id_idx" ON "appointments"("service_id");

-- CreateIndex
CREATE INDEX "appointments_appointment_date_idx" ON "appointments"("appointment_date");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "login_history_user_id_idx" ON "login_history"("user_id");

-- CreateIndex
CREATE INDEX "login_history_login_at_idx" ON "login_history"("login_at");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_transaction_id_key" ON "wallet_transactions"("transaction_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_idx" ON "wallet_transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_transaction_id_idx" ON "wallet_transactions"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "digital_locker_items_document_id_key" ON "digital_locker_items"("document_id");

-- CreateIndex
CREATE INDEX "digital_locker_items_user_id_idx" ON "digital_locker_items"("user_id");

-- CreateIndex
CREATE INDEX "digital_locker_items_category_idx" ON "digital_locker_items"("category");

-- CreateIndex
CREATE UNIQUE INDEX "chat_sessions_session_id_key" ON "chat_sessions"("session_id");

-- CreateIndex
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");

-- CreateIndex
CREATE INDEX "chat_sessions_admin_id_idx" ON "chat_sessions"("admin_id");

-- CreateIndex
CREATE INDEX "chat_sessions_is_active_idx" ON "chat_sessions"("is_active");

-- CreateIndex
CREATE INDEX "chat_messages_session_id_idx" ON "chat_messages"("session_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_applications" ADD CONSTRAINT "service_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_applications" ADD CONSTRAINT "service_applications_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_applications" ADD CONSTRAINT "service_applications_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_uploads" ADD CONSTRAINT "document_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_uploads" ADD CONSTRAINT "document_uploads_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "service_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_uploads" ADD CONSTRAINT "document_uploads_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_schemes" ADD CONSTRAINT "user_saved_schemes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_schemes" ADD CONSTRAINT "user_saved_schemes_scheme_id_fkey" FOREIGN KEY ("scheme_id") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_responded_by_fkey" FOREIGN KEY ("responded_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_activity_log" ADD CONSTRAINT "admin_activity_log_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "service_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "service_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_locker_items" ADD CONSTRAINT "digital_locker_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_admin_id_fkey" FOREIGN KEY ("sender_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
