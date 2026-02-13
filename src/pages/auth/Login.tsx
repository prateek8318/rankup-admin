import React, { useState, useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from '../../auth/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../../assets/images/login-illustration.png';
import rankupLogo from '../../assets/images/rankup-logo.png';

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #052B76 0%, #0950DC 100%)',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
  leftImage: {
    maxWidth: '420px',
    width: '100%',
    height: 'auto',
    objectFit: 'contain' as const,
  },
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
  logoImage: {
    height: '72px',
    width: 'auto',
    marginBottom: '8px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#111827',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
  },
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
  options: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  remember: {
    display: 'flex',
    alignItems: 'center',
  },
  rememberCheckbox: {
    width: '16px',
    height: '16px',
  },
  rememberText: {
    marginLeft: '8px',
    color: '#111827',
  },
  forgot: {
    color: '#111827',
    fontWeight: 500,
    textDecoration: 'none',
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

const Loginpage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  }, []);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({ email, password });

    if (result.success) {
      if (result.requiresTwoFactor) {
        // Navigate to OTP verification page with email and mobile number
        navigate('/two-step-verification', { 
          state: { 
            email: email, 
            mobileNumber: result.mobileNumber 
          } 
        });
      } else {
        // Direct login for non-two-factor users
        navigate('/home');
      }
    } else {
      alert(result.error || 'Login failed. Please check credentials.');
      console.error(result.error);
    } 
  };
  
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Left - Image */}
        <div style={styles.left}>
          <img
            src={loginIllustration}
            alt="Login illustration"
            style={styles.leftImage}
          />
        </div>

        {/* Right - Form */}
        <div style={styles.right}>
          <div style={styles.logoWrapper}>
            <img
              src={rankupLogo}
              alt="Rankup Logo"
              style={styles.logoImage}
            />
            <h4 style={styles.title}>Log In</h4>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>

            <div style={styles.options}>
              <label style={styles.remember}>
                <input
                  id="keepLoggedIn"
                  type="checkbox"
                  style={styles.rememberCheckbox}
                />
                <span style={styles.rememberText}>Keep me logged in</span>
              </label>

              <a href="/forgot-password" style={styles.forgot}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" style={styles.button}>
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
