import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '@/assets/images/forgot.png';
import rankupLogo from '@/assets/images/rankup-logo.png';

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #052B76 0%, #0950DC 100%)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 18px 45px rgba(5, 43, 118, 0.45)',
    display: 'flex',
    overflow: 'hidden',
  },
  left: {
    flex: 1,
    backgroundColor: '#97a6b7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
  },
  leftImage: { maxWidth: '420px', width: '100%', height: '80%', objectFit: 'contain' as const },
  right: {
    flex: 1,
    padding: '40px 56px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  logoImage: { height: '72px', width: 'auto', marginBottom: '8px' },
  title: { fontSize: '22px', fontWeight: 700, color: '#111827' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#111827' },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #374151',
    color: '#111827',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #052B76 0%, #0950DC 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(5, 43, 118, 0.4)',
  },
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      setSubmitted(true);
      alert('Password reset link sent to your email');
    } catch {
      alert('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.right}>
            <div style={styles.logoWrapper}>
              <img src={rankupLogo} alt="Rankup" style={styles.logoImage} />
              <h4 style={styles.title}>Check Your Email</h4>
            </div>
            <p style={{ textAlign: 'center', marginBottom: 16 }}>We've sent a password reset link to</p>
            <p style={{ fontWeight: 600, textAlign: 'center', marginBottom: 24 }}>{email}</p>
            <button onClick={() => navigate('/login')} style={styles.button}>Back to Login</button>
            <p style={{ fontSize: 14, textAlign: 'center', marginTop: 16 }}>
              Didn't receive email? <button type="button" onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>Try again</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.left}>
          <img src={loginIllustration} alt="Forgot password" style={styles.leftImage} />
        </div>
        <div style={styles.right}>
          <div style={styles.logoWrapper}>
            <img src={rankupLogo} alt="Rankup" style={styles.logoImage} />
            <h4 style={styles.title}>Forgot Password ?</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your recovery email"
                required
              />
            </div>
            <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending...' : 'Recover Password'}
            </button>
          </form>
          <p style={{ fontSize: 14, textAlign: 'center', marginTop: 24 }}>
            Remember your password? <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
