import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './AuthPages.css';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const refs = useRef([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Please enter all 6 digits');

    setLoading(true);
    try {
      await authService.verifyOTP({ email: user?.email, otp: otpCode });
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      await authService.resendOTP({ email: user?.email });
      toast.success('New OTP sent!');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="premium-auth-page">
      <div className="auth-showcase">
        <motion.div className="auth-showcase-content" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="auth-showcase-logo"><ShieldCheck size={48} /></div>
          <h1>Verify Your Email</h1>
          <p>We've sent a 6-digit verification code to your email address. Enter it below to complete your registration.</p>
        </motion.div>
      </div>

      <div className="auth-form-section">
        <motion.div className="auth-glass-panel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="auth-header">
            <h2>Enter OTP</h2>
            <p>Verification code sent to <strong>{user?.email || 'your email'}</strong></p>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '32px 0' }}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => refs.current[i] = el} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} onPaste={i === 0 ? handlePaste : undefined}
                  style={{ width: '52px', height: '60px', textAlign: 'center', fontSize: '24px', fontWeight: 700, borderRadius: '12px', border: '2px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
              ))}
            </div>
            <button type="submit" className="auth-btn-primary" disabled={loading || otp.join('').length !== 6}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
            {timer > 0 ? (
              <span>Resend code in <strong>{timer}s</strong></span>
            ) : (
              <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Resend OTP</button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
