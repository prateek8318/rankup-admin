import React, { useState, useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../../assets/images/forgot.png';
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
    height: '80%',
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

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: true,
    });
  }, []);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      alert('Password reset link sent to your email');
    } catch (error) {
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
              <img
                src={rankupLogo}
                alt="Rankup Logo"
                style={styles.logoImage}
              />
              <h4 style={styles.title}>Check Your Email</h4>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-gray-700 mb-4">
                We've sent a password reset link to
              </p>
              <p className="font-medium text-gray-900">
                {email}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                style={styles.button}
              >
                Back to Login
              </button>
              
              <p className="text-sm text-gray-600 text-center">
                Didn't receive email?{' '}
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Left - Image */}
        <div style={styles.left}>
          <img
            src={loginIllustration}
            alt="Forgot password illustration"
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
            <h4 style={styles.title}>Forgot Password ?</h4>
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
                placeholder="Enter your recovery email"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Recover Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-500 font-medium"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
