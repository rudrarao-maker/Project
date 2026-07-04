import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/dataService';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  return (
    <div className="premium-auth-page">
      <div className="auth-showcase">
        <motion.div className="auth-showcase-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="auth-showcase-logo">🔐</div>
          <h1>Reset Your Password</h1>
          <p>Don't worry, it happens to the best of us. Enter your email and we'll send you a secure reset link.</p>
        </motion.div>
      </div>

      <div className="auth-form-section">
        <motion.div className="auth-glass-panel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <h2 style={{ marginBottom: '12px' }}>Check Your Email</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>We've sent a password reset link to <strong>{email}</strong>. The link will expire in 1 hour.</p>
              <Link to="/login" className="auth-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h2>Forgot Password</h2>
                <p>Enter your registered email address</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <Mail size={18} className="auth-input-icon" />
                    <input type="email" className="auth-input" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : (<>Send Reset Link <Send size={18} /></>)}
                </button>
              </form>
              <div className="auth-footer">
                Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
