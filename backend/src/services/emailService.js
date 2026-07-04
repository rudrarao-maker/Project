const nodemailer = require('nodemailer');
const config = require('../config');

// Create transporter (will fail gracefully if not configured)
let transporter = null;

if (config.smtp.user && config.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

/**
 * Send an email (logs to console if SMTP not configured)
 */
async function sendEmail(to, subject, html) {
  if (!transporter) {
    console.log(`📧 [Email - Console Mode]`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body: ${html.substring(0, 200)}...`);
    return { success: true, mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Gov E-Services" <${config.smtp.from}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('📧 Email error:', error.message);
    return { success: false, error: error.message };
  }
}

// Shared email wrapper
const emailWrapper = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #FF9933, #138808); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0;">🇮🇳 Gov E-Services</h1>
    </div>
    <div style="padding: 30px; background: #fff;">
      ${content}
    </div>
    <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
      Government of India | National Portal
    </div>
  </div>`;

// Email templates
const templates = {
  registration: (name) => ({
    subject: 'Welcome to Gov E-Services Portal',
    html: emailWrapper(`
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been successfully created on the Government E-Services Portal.</p>
      <p>You can now access all government services and schemes from your dashboard.</p>
      <a href="${config.cors.origin}/dashboard" style="display: inline-block; background: #000080; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">Go to Dashboard</a>
    `),
  }),

  applicationSubmitted: (name, serviceName, appNumber) => ({
    subject: `Application Submitted - ${appNumber}`,
    html: emailWrapper(`
      <h2>Application Submitted Successfully!</h2>
      <p>Dear ${name},</p>
      <p>Your application for <strong>${serviceName}</strong> has been submitted.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application No.</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${appNumber}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${serviceName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Pending</td></tr>
      </table>
      <a href="${config.cors.origin}/track" style="display: inline-block; background: #000080; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Track Application</a>
    `),
  }),

  applicationStatusUpdate: (name, serviceName, appNumber, status, remarks) => ({
    subject: `Application ${status.charAt(0).toUpperCase() + status.slice(1)} - ${appNumber}`,
    html: emailWrapper(`
      <h2>Application Status Update</h2>
      <p>Dear ${name},</p>
      <p>Your application <strong>${appNumber}</strong> for <strong>${serviceName}</strong> has been <strong style="color: ${status === 'approved' ? '#28a745' : '#dc3545'}">${status.toUpperCase()}</strong>.</p>
      ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
    `),
  }),

  passwordReset: (name, resetLink) => ({
    subject: 'Password Reset Request - Gov E-Services',
    html: emailWrapper(`
      <h2>Password Reset Request</h2>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <a href="${resetLink}" style="display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">Reset Password</a>
      <p style="margin-top: 20px; color: #666; font-size: 13px;">This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
    `),
  }),

  otpVerification: (name, otp) => ({
    subject: 'Email Verification OTP - Gov E-Services',
    html: emailWrapper(`
      <h2>Email Verification</h2>
      <p>Dear ${name},</p>
      <p>Your OTP for email verification is:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; background: #f5f5f5; padding: 16px 32px; border-radius: 8px; color: #000080;">${otp}</span>
      </div>
      <p style="color: #666; font-size: 13px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
    `),
  }),

  grievanceSubmitted: (name, grievanceNumber) => ({
    subject: `Grievance Registered - ${grievanceNumber}`,
    html: emailWrapper(`
      <h2>Grievance Registered Successfully</h2>
      <p>Dear ${name},</p>
      <p>Your grievance has been registered with the following details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Grievance No.</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${grievanceNumber}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">Open</td></tr>
      </table>
      <p>We will review your grievance and get back to you at the earliest.</p>
    `),
  }),

  appointmentConfirmation: (name, details) => ({
    subject: `Appointment Confirmed - ${details.confirmationNumber}`,
    html: emailWrapper(`
      <h2>Appointment Confirmed</h2>
      <p>Dear ${name},</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Confirmation No.</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${details.confirmationNumber}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date(details.appointmentDate).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time Slot</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${details.timeSlot}</td></tr>
        ${details.officeLocation ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${details.officeLocation}</td></tr>` : ''}
      </table>
      <p style="color: #666; font-size: 13px;">Please arrive 15 minutes before your scheduled time. Carry a valid ID proof.</p>
    `),
  }),

  grievanceStatusUpdate: (name, grievanceNumber, status, resolution) => ({
    subject: `Grievance Update - ${grievanceNumber}`,
    html: emailWrapper(`
      <h2>Grievance Status Update</h2>
      <p>Dear ${name},</p>
      <p>Your grievance <strong>${grievanceNumber}</strong> has been updated to: <strong style="color: ${status === 'resolved' ? '#28a745' : '#f59e0b'}">${status.toUpperCase()}</strong></p>
      ${resolution ? `<p><strong>Resolution:</strong> ${resolution}</p>` : ''}
    `),
  }),
};

module.exports = { sendEmail, templates };
