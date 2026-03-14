import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './LoginForm.module.css';

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
      toast.error(result.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          placeholder="Enter your password"
          required
        />
      </div>
      <div className={styles.options}>
        <label className={styles.remember}>
          <input id="keepLoggedIn" type="checkbox" className={styles.rememberCheckbox} />
          <span className={styles.rememberText}>Keep me logged in</span>
        </label>
        <a href="/forgot-password" className={styles.forgot}>Forgot Password?</a>
      </div>
      <button type="submit" className={styles.button}>Log In</button>
    </form>
  );
};
