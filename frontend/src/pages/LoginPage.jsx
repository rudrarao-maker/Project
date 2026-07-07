import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Camera,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./AuthPages.css";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [faceAuthStatus, setFaceAuthStatus] = useState("scanning"); // scanning, success, failed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success("Login successful!");
      navigate(
        ["super_admin", "admin", "officer", "reviewer"].includes(user.role)
          ? "/admin"
          : "/dashboard",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFaceAuth = () => {
    setShowFaceAuth(true);
    setFaceAuthStatus("scanning");
    // Simulate Face Scanning Delay
    setTimeout(() => {
      setFaceAuthStatus("success");
      setTimeout(() => {
        toast.success("Face Authentication successful!");
        // Mocking login for the demo user
        login({ email: "test@example.com", password: "password" })
          .then((user) => {
             navigate(["super_admin", "admin", "officer", "reviewer"].includes(user?.role) ? "/admin" : "/dashboard");
          })
          .catch(() => setShowFaceAuth(false));
      }, 1500);
    }, 3000);
  };

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
          <h1>Secure Access to Digital Services</h1>
          <p>
            Experience a seamless, unified gateway to all government services,
            schemes, and documents with enterprise-grade security.
          </p>

          <div style={{ display: "flex", gap: "24px", marginTop: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#93c5fd",
              }}
            >
              <ShieldCheck size={20} /> <span>256-bit Encryption</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#93c5fd",
              }}
            >
              <CheckCircle2 size={20} /> <span>Aadhaar Verified</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Glassmorphic Form */}
      <div className="auth-form-section">
        <motion.div
          className="auth-glass-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="#" className="auth-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Secure Login <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <div className="auth-divider" style={{ textAlign: "center", margin: "24px 0", color: "#64748b", fontSize: "14px", position: "relative" }}>
               <span style={{ background: "white", padding: "0 10px", position: "relative", zIndex: 1 }}>OR</span>
               <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#e2e8f0", zIndex: 0 }}></div>
            </div>

            <button
              type="button"
              className="auth-btn-secondary"
              style={{ width: "100%", padding: "12px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontWeight: 600, color: "var(--gov-blue)", cursor: "pointer" }}
              onClick={handleFaceAuth}
            >
              <Camera size={18} /> Login with Face Authentication
            </button>
          </form>

          <div className="auth-footer">
            New to the portal?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </div>

          <div
            style={{
              marginTop: "32px",
              padding: "16px",
              background: "rgba(128,128,128,0.05)",
              borderRadius: "12px",
              textAlign: "center",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <strong>Demo Access:</strong>
            <br />
            superadmin@gov.in / password
            <br />
            test@example.com / password
          </div>
        </motion.div>
      </div>

      {/* Face Authentication Modal */}
      {showFaceAuth && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(5px)" }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: "white", padding: "32px", borderRadius: "16px", width: "400px", textAlign: "center", position: "relative" }}
          >
            <button onClick={() => setShowFaceAuth(false)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
              <X size={24} />
            </button>
            <h3 style={{ marginTop: 0, color: "var(--gov-navy)", marginBottom: "24px" }}>Face Authentication</h3>
            
            <div style={{ width: "200px", height: "200px", margin: "0 auto", borderRadius: "50%", border: `4px solid ${faceAuthStatus === 'success' ? '#10b981' : 'var(--gov-blue)'}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
               {faceAuthStatus === "scanning" && (
                 <>
                   <Camera size={48} color="#94a3b8" />
                   <motion.div 
                     animate={{ top: ["0%", "100%", "0%"] }}
                     transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                     style={{ position: "absolute", left: 0, right: 0, height: "4px", background: "rgba(14, 165, 233, 0.5)", boxShadow: "0 0 10px rgba(14,165,233,0.8)" }}
                   />
                 </>
               )}
               {faceAuthStatus === "success" && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                   <CheckCircle2 size={64} color="#10b981" />
                 </motion.div>
               )}
            </div>
            
            <div style={{ marginTop: "24px", fontSize: "16px", fontWeight: 500, color: faceAuthStatus === 'success' ? '#10b981' : '#64748b' }}>
              {faceAuthStatus === "scanning" ? "Scanning your face... Please hold still." : "Face verified successfully! Logging you in..."}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
