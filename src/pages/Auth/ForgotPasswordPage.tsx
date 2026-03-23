import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import forgotIllustration from '@/assets/images/forgot.png';
import styles from '@/styles/auth/ForgotPasswordPage.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const trimmedEmail = email.trim();
  const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
  const canSubmit = !loading && trimmedEmail.length > 0 && isEmailValid;

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Email address is required';
    }

    if (!EMAIL_REGEX.test(value.trim())) {
      return 'Please enter a valid email address';
    }

    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setErrorMessage('');
      return;
    }

    setErrorMessage(validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const result = await forgotPassword?.(trimmedEmail);

    if (result && result.success) {
      setSubmitted(true);
    } else {
      setErrorMessage('Failed to send reset link. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.left}>
          <img src={forgotIllustration} alt="Forgot password" className={styles.leftImage} />
        </div>

        <div className={styles.right}>
          {submitted ? (
            <div>
              <h2 className={styles.title} style={{ textAlign: 'center', marginBottom: 16 }}>
                Check your email
              </h2>
              <p style={{ textAlign: 'center', marginBottom: 16 }}>
                We&apos;ve sent a password reset link to
              </p>
              <p style={{ fontWeight: 600, textAlign: 'center', marginBottom: 24 }}>
                {email}
              </p>
              <button
                onClick={() => navigate('/login')}
                className={styles.button}
              >
                Return to Login
              </button>
              <p style={{ fontSize: 14, textAlign: 'center', marginTop: 16 }}>
                Didn&apos;t receive email?{' '}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 className={styles.title}>Forgot Password?</h2>
              </div>

              <div className={styles.formGroup}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={styles.input}
                  placeholder="Enter Your Recovery Email"
                  required
                />
                {errorMessage && (
                  <p style={{ marginTop: 8, fontSize: 14, color: '#dc2626' }}>
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={styles.button}
                style={{ opacity: canSubmit ? 1 : 0.7 }}
              >
                {loading ? 'Sending...' : 'Recover Password'}
              </button>

              <p style={{ fontSize: 14, textAlign: 'center', marginTop: 20 }}>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
