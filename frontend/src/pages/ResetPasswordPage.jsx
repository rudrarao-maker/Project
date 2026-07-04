import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/dataService';
import { Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const getStrength = (pass) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const strength = getStrength(form.newPassword);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword: form.newPassword });
      setSuccess(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  if (!token) {
    return (
      <div className="premium-auth-page">
        <div className="auth-form-section" style={{ flex: 1, justifyContent: 'center' }}>
          <div className="auth-glass-panel" style={{ textAlign: 'center' }}>
            <h2>Invalid Reset Link</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0' }}>This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="auth-btn-primary" style={{ textDecoration: 'none' }}>Request New Link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-auth-page">
      <div className="auth-showcase">
        <motion.div className="auth-showcase-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="auth-showcase-logo">🔑</div>
          <h1>Create New Password</h1>
          <p>Choose a strong password to protect your account. Must be at least 8 characters with uppercase, lowercase, and a number.</p>
        </motion.div>
      </div>

      <div className="auth-form-section">
        <motion.div className="auth-glass-panel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
              <h2>Password Reset!</h2>
              <p style={{ color: 'var(--text-muted)' }}>Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <h2>Set New Password</h2>
                <p>Enter your new password below</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="auth-input-group">
                  <label className="auth-label">New Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <input type={showPass ? 'text' : 'password'} className="auth-input" placeholder="••••••••" required minLength={8} value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
                  {form.newPassword && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        {[1,2,3,4,5].map(i => (<div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= strength ? strengthColor : 'var(--border-color)' }} />))}
                      </div>
                      <span style={{ fontSize: '12px', color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <input type="password" className="auth-input" placeholder="••••••••" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="auth-btn-primary" disabled={loading || strength < 3}>
                  {loading ? 'Resetting...' : (<>Reset Password <ArrowRight size={18} /></>)}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
