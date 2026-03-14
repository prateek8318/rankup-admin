import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth() as any;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error('Failed to send reset link. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {submitted ? (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>
            <h2 className={styles.title}>Check your email</h2>
            <p style={{ textAlign: 'center', marginBottom: 16 }}>We've sent a password reset link to</p>
            <p style={{ fontWeight: 600, textAlign: 'center', marginBottom: 24 }}>{email}</p>
            <button onClick={() => navigate('/login')} className={styles.button}>Return to Login</button>
            <p style={{ fontSize: 14, textAlign: 'center', marginTop: 16 }}>
              Didn't receive email? <button type="button" onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>Try again</button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
              <h2 className={styles.title}>Forgot Password</h2>
              <p className={styles.subtitle}>Enter your email address to reset your password.</p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
          </form>
        )}
        {!submitted && (
          <p style={{ fontSize: 14, textAlign: 'center', marginTop: 24 }}>
            Remember your password? <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>Sign in</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
