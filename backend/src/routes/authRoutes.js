const router = require("express").Router();
const {
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
} = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");
const { authenticate } = require("../middleware/auth");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/reset-password", resetPasswordValidator, resetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/me", authenticate, getMe);
router.post("/login-2fa", login2FA);
router.post("/setup-2fa", authenticate, setup2FA);
router.post("/verify-2fa-setup", authenticate, verify2FASetup);
module.exports = router;
