const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");
const config = require("../config");
const ApiResponse = require("../utils/apiResponse");
const { generateUserId, generateOTP } = require("../utils/generateId");
const { sendEmail, templates } = require("../services/emailService");

const prisma = new PrismaClient();

/**
 * Helper: Set JWT as HttpOnly cookie
 */
const setTokenCookie = (res, token) => {
  res.cookie(config.cookie.name, token, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.cookie.maxAge,
    path: "/",
  });
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, "Validation failed", 400, errors.array());
    }

    const { name, email, mobile, password, aadhaar } = req.body;

    // Check if email exists in users or admins
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return ApiResponse.error(res, "Email already registered", 409);
    }

    const existingMobile = await prisma.user.findUnique({ where: { mobile } });
    if (existingMobile) {
      return ApiResponse.error(res, "Mobile number already registered", 409);
    }

    if (aadhaar) {
      const existingAadhaar = await prisma.user.findUnique({
        where: { aadhaarNumber: aadhaar },
      });
      if (existingAadhaar) {
        return ApiResponse.error(res, "Aadhaar number already registered", 409);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate userId
    const userId = await generateUserId(prisma);

    // Create user
    const user = await prisma.user.create({
      data: {
        userId,
        name,
        email,
        mobile,
        aadhaarNumber: aadhaar || null,
        password: hashedPassword,
        status: "active",
      },
      select: { id: true, userId: true, name: true, email: true, mobile: true },
    });

    // Generate and send OTP for email verification
    const otp = generateOTP(config.otp.length);
    const otpHash = await bcrypt.hash(otp, 10);
    await prisma.oTPVerification.create({
      data: {
        userId: user.id,
        email,
        mobile, // We link mobile too
        otpHash,
        type: "email_verification",
        expiresAt: new Date(
          Date.now() + config.otp.expiresInMinutes * 60 * 1000,
        ),
      },
    });

    // MOCK SMS LOGIC: If Twilio was configured, we would send SMS here.
    console.log(`[MOCK SMS] Sending OTP ${otp} to mobile number ${mobile}`);

    sendEmail(
      email,
      templates.otpVerification(name, otp).subject,
      templates.otpVerification(name, otp).html,
    ).catch(() => {});

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: "user" },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    // Set token as HttpOnly cookie
    setTokenCookie(res, token);

    // Send welcome email (async, don't block)
    sendEmail(
      email,
      templates.registration(name).subject,
      templates.registration(name).html,
    ).catch(() => {});

    return ApiResponse.success(
      res,
      "Registration successful! Please verify your email.",
      {
        user: { ...user, role: "user" },
        requiresVerification: true,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, "Validation failed", 400, errors.array());
    }

    const { email, password } = req.body;

    // First check admins table (mirrors existing PHP login_handler.php)
    let user = null;
    let isAdmin = false;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin && admin.status === "active") {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword) {
        user = admin;
        isAdmin = true;
      }
    }

    // If not admin, check users table
    if (!user) {
      const regularUser = await prisma.user.findUnique({ where: { email } });
      if (regularUser && regularUser.status === "active") {
        const validPassword = await bcrypt.compare(
          password,
          regularUser.password,
        );
        if (validPassword) {
          user = regularUser;
        }
      }
    }

    if (!user) {
      return ApiResponse.error(res, "Invalid email or password", 401);
    }

    // Check if 2FA is required for Admin
    if (isAdmin && user.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: user.id, role: user.role, isTemp: true },
        config.jwt.secret,
        { expiresIn: "5m" },
      );
      return ApiResponse.success(res, "2FA Verification Required", {
        requires2FA: true,
        tempToken,
      });
    }

    // Update last login
    if (isAdmin) {
      await prisma.admin.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Record login history for users
      await prisma.loginHistory
        .create({
          data: {
            userId: user.id,
            ipAddress: req.ip || req.connection?.remoteAddress || null,
            userAgent: req.headers?.["user-agent"] || null,
          },
        })
        .catch(() => {});
    }

    // Generate JWT
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: isAdmin ? user.role : "user",
    };
    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    // Set token as HttpOnly cookie
    setTokenCookie(res, token);

    // Build response (without password)
    const userData = isAdmin
      ? {
          id: user.id,
          adminId: user.adminId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        }
      : {
          id: user.id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: "user",
          mobile: user.mobile,
        };

    return ApiResponse.success(res, "Login successful", {
      user: userData,
      redirect: isAdmin ? "/admin" : "/dashboard",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  // Clear the HttpOnly cookie
  res.clearCookie(config.cookie.name, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: "/",
  });
  return ApiResponse.success(res, "Logged out successfully");
};

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return ApiResponse.success(
        res,
        "If an account with that email exists, a reset link has been sent.",
      );
    }

    // Invalidate existing reset tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Generate reset token (JWT-based)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email, purpose: "password_reset" },
      config.jwt.secret,
      { expiresIn: `${config.passwordReset.expiresInMinutes}m` },
    );

    // Store reset token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(
          Date.now() + config.passwordReset.expiresInMinutes * 60 * 1000,
        ),
      },
    });

    // Send reset email
    const resetLink = `${config.cors.origin}/reset-password?token=${resetToken}`;
    sendEmail(
      email,
      templates.passwordReset(user.name, resetLink).subject,
      templates.passwordReset(user.name, resetLink).html,
    ).catch(() => {});

    return ApiResponse.success(
      res,
      "If an account with that email exists, a reset link has been sent.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, "Validation failed", 400, errors.array());
    }

    const { token, newPassword } = req.body;

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch {
      return ApiResponse.error(res, "Invalid or expired reset token", 400);
    }

    if (decoded.purpose !== "password_reset") {
      return ApiResponse.error(res, "Invalid token", 400);
    }

    // Check token in database
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: { token, used: false, expiresAt: { gt: new Date() } },
    });

    if (!resetRecord) {
      return ApiResponse.error(
        res,
        "Reset token has expired or already been used",
        400,
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    return ApiResponse.success(
      res,
      "Password has been reset successfully. You can now log in with your new password.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ApiResponse.error(res, "Email and OTP are required", 400);
    }

    // Find latest unused OTP for this email
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        email,
        type: "email_verification",
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return ApiResponse.error(
        res,
        "OTP has expired or is invalid. Please request a new one.",
        400,
      );
    }

    // Check max attempts
    if (otpRecord.attempts >= config.otp.maxAttempts) {
      return ApiResponse.error(
        res,
        "Too many failed attempts. Please request a new OTP.",
        429,
      );
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
      // Increment attempts
      await prisma.oTPVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 },
      });
      return ApiResponse.error(res, "Invalid OTP. Please try again.", 400);
    }

    // Mark OTP as used
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Update user email verification status
    if (otpRecord.userId) {
      await prisma.user.update({
        where: { id: otpRecord.userId },
        data: { emailVerified: true },
      });
    }

    return ApiResponse.success(res, "Email verified successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp
 */
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.error(res, "Email is required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return ApiResponse.error(res, "No account found with this email", 404);
    }

    if (user.emailVerified) {
      return ApiResponse.success(res, "Email is already verified");
    }

    // Rate limit: check if OTP was sent in the last 60 seconds
    const recentOTP = await prisma.oTPVerification.findFirst({
      where: {
        email,
        type: "email_verification",
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentOTP) {
      return ApiResponse.error(
        res,
        "Please wait at least 60 seconds before requesting a new OTP",
        429,
      );
    }

    // Generate new OTP
    const otp = generateOTP(config.otp.length);
    const otpHash = await bcrypt.hash(otp, 10);

    await prisma.oTPVerification.create({
      data: {
        userId: user.id,
        email,
        otpHash,
        type: "email_verification",
        expiresAt: new Date(
          Date.now() + config.otp.expiresInMinutes * 60 * 1000,
        ),
      },
    });

    sendEmail(
      email,
      templates.otpVerification(user.name, otp).subject,
      templates.otpVerification(user.name, otp).html,
    ).catch(() => {});

    return ApiResponse.success(res, "A new OTP has been sent to your email");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return ApiResponse.success(res, "User profile retrieved", { user: req.user });
};

/**
 * POST /api/auth/login-2fa
 */
const login2FA = async (req, res, next) => {
  try {
    const { token, tempToken } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(tempToken, config.jwt.secret);
    } catch {
      return ApiResponse.error(res, "Invalid or expired temporary token", 400);
    }

    if (!decoded.isTemp)
      return ApiResponse.error(res, "Invalid token type", 400);

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
    if (!admin || !admin.twoFactorEnabled)
      return ApiResponse.error(res, "Invalid 2FA request", 400);

    const isValid = authenticator.verify({
      token,
      secret: admin.twoFactorSecret,
    });
    if (!isValid) return ApiResponse.error(res, "Invalid 2FA code", 400);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    const finalToken = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );
    setTokenCookie(res, finalToken);

    return ApiResponse.success(res, "Login successful", {
      user: {
        id: admin.id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
      },
      redirect: "/admin",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/setup-2fa
 */
const setup2FA = async (req, res, next) => {
  try {
    if (
      !["super_admin", "admin", "officer", "reviewer"].includes(req.user.role)
    ) {
      return ApiResponse.error(res, "Only admins can setup 2FA", 403);
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(admin.email, "GovEServices", secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    await prisma.admin.update({
      where: { id: req.user.id },
      data: { twoFactorSecret: secret, twoFactorEnabled: false },
    });

    return ApiResponse.success(res, "2FA setup initiated", {
      qrCodeUrl,
      secret,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-2fa-setup
 */
const verify2FASetup = async (req, res, next) => {
  try {
    const { token } = req.body;
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    if (!admin || !admin.twoFactorSecret)
      return ApiResponse.error(res, "2FA not initiated", 400);

    const isValid = authenticator.verify({
      token,
      secret: admin.twoFactorSecret,
    });
    if (!isValid)
      return ApiResponse.error(res, "Invalid verification code", 400);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { twoFactorEnabled: true },
    });

    return ApiResponse.success(
      res,
      "Two-Factor Authentication has been successfully enabled.",
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  getMe,
  login2FA,
  setup2FA,
  verify2FASetup,
};
