import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./AuthPages.css";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    aadhaar: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(form.password);
  const getStrengthColor = () => {
    if (strength === 0) return "rgba(128,128,128,0.2)";
    if (strength <= 2) return "#ef4444"; // Red
    if (strength <= 4) return "#f59e0b"; // Yellow
    return "#10b981"; // Green
  };

  const getStrengthText = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="premium-auth-page">
      {/* LEFT: Premium Showcase */}
      <div className="auth-showcase">
        <motion.div
          className="auth-showcase-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="auth-showcase-logo">🏛️</div>
          <h1>Join the Digital India Initiative</h1>
          <p>
            Create your unified citizen account to access hundreds of government
            services, schemes, and official documents from a single secure
            portal.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#93c5fd",
              }}
            >
              <ShieldCheck size={24} />{" "}
              <span style={{ fontSize: "16px" }}>One Portal, All Services</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#93c5fd",
              }}
            >
              <CheckCircle2 size={24} />{" "}
              <span style={{ fontSize: "16px" }}>
                Paperless Application Process
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#93c5fd",
              }}
            >
              <BadgeCheck size={24} />{" "}
              <span style={{ fontSize: "16px" }}>
                Instant Verification via Aadhaar
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Glassmorphic Form */}
      <div className="auth-form-section" style={{ overflowY: "auto" }}>
        <motion.div
          className="auth-glass-panel"
          style={{ margin: "40px 0" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Register for government e-services</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Full Name *</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Enter full name"
                  required
                  value={form.name}
                  onChange={updateField("name")}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Email Address *</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  required
                  value={form.email}
                  onChange={updateField("email")}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Mobile Number *</label>
              <div className="auth-input-wrapper">
                <Phone size={18} className="auth-input-icon" />
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="10-digit mobile number"
                  required
                  pattern="[6-9]\d{9}"
                  value={form.mobile}
                  onChange={updateField("mobile")}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password *</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Min 6 characters"
                  required
                  value={form.password}
                  onChange={updateField("password")}
                />
              </div>
              {/* Password Strength Indicator */}
              {form.password.length > 0 && (
                <>
                  <div className="password-strength">
                    <div
                      className="strength-bar"
                      style={{
                        background: strength >= 1 ? getStrengthColor() : "",
                      }}
                    ></div>
                    <div
                      className="strength-bar"
                      style={{
                        background: strength >= 3 ? getStrengthColor() : "",
                      }}
                    ></div>
                    <div
                      className="strength-bar"
                      style={{
                        background: strength >= 5 ? getStrengthColor() : "",
                      }}
                    ></div>
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: getStrengthColor() }}
                  >
                    {getStrengthText()}
                  </span>
                </>
              )}
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Confirm Password *</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Re-enter password"
                  required
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                />
              </div>
            </div>

            <div className="auth-options" style={{ marginBottom: "24px" }}>
              <label className="auth-checkbox">
                <input type="checkbox" required /> I agree to the Terms &
                Conditions
              </label>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Register Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
