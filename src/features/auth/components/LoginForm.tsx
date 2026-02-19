import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const styles = {
  formGroup: { marginBottom: '20px' as const },
  label: { display: 'block' as const, marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#111827' },
  input: {
    width: '100%' as const,
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #374151',
    color: '#111827',
    fontSize: '14px',
    outline: 'none' as const,
    boxSizing: 'border-box' as const,
  },
  options: { display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, gap: '12px', marginBottom: '24px', fontSize: '14px' },
  remember: { display: 'flex' as const, alignItems: 'center' as const },
  rememberCheckbox: { width: 16, height: 16 },
  rememberText: { marginLeft: '8px', color: '#111827' },
  forgot: { color: '#111827', fontWeight: 500, textDecoration: 'none' as const },
  button: {
    width: '100%' as const,
    padding: '12px 16px',
    borderRadius: '999px',
    border: 'none' as const,
    background: 'linear-gradient(135deg, #052B76 0%, #0950DC 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer' as const,
    boxShadow: '0 8px 18px rgba(5, 43, 118, 0.4)',
  },
};

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      if (result.requiresTwoFactor) {
        navigate('/two-step-verification', { state: { email, mobileNumber: result.mobileNumber } });
      } else {
        onSuccess?.();
        navigate('/home');
      }
    } else {
      alert(result.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>Email Address</label>
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
        <label htmlFor="password" style={styles.label}>Password</label>
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
          <input id="keepLoggedIn" type="checkbox" style={styles.rememberCheckbox} />
          <span style={styles.rememberText}>Keep me logged in</span>
        </label>
        <a href="/forgot-password" style={styles.forgot}>Forgot Password?</a>
      </div>
      <button type="submit" style={styles.button}>Log In</button>
    </form>
  );
};
