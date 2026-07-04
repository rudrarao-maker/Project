import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success('Login successful!');
      navigate(['super_admin', 'admin', 'officer', 'reviewer'].includes(user.role) ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
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
          <p>Experience a seamless, unified gateway to all government services, schemes, and documents with enterprise-grade security.</p>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd' }}>
              <ShieldCheck size={20} /> <span>256-bit Encryption</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd' }}>
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
                  onChange={e => setForm({ ...form, email: e.target.value })} 
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
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                />
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="#" className="auth-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : (
                <>Secure Login <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-footer">
            New to the portal? <Link to="/register" className="auth-link">Create an account</Link>
          </div>

          <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(128,128,128,0.05)', borderRadius: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <strong>Demo Access:</strong><br/>
            admin@gov.in / password<br/>
            test@example.com / password
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
