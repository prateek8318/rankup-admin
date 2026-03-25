import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useNotificationService } from "@/services/notificationService";
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';

import styles from '@/styles/components/LoginForm.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const notificationService = useNotificationService();

  useEffect(() => {
    const savedEmail = Cookies.get('userEmail');
    const savedPassword = Cookies.get('userPassword');
    const savedKeepLoggedIn = Cookies.get('keepLoggedIn');
    
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedKeepLoggedIn === 'true') setKeepLoggedIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    if (keepLoggedIn) {
      Cookies.set('userEmail', email, { expires: 30 });
      Cookies.set('userPassword', password, { expires: 30 });
      Cookies.set('keepLoggedIn', 'true', { expires: 30 });
    } else {
      Cookies.remove('userEmail');
      Cookies.remove('userPassword');
      Cookies.remove('keepLoggedIn');
    }
    
    try {
      const result = await login({ email, password });
      if (result.success) {
        try {
          notificationService.success(
            '🎉 Welcome Back!', 
            'Login successful! Redirecting to dashboard...',
            { duration: 3000 }
          );
        } catch (error) {
          // Fallback: simple alert
          alert('🎉 Login successful! Redirecting to dashboard...');
        }
        
        // Small delay to let the user see the success message
        setTimeout(() => {
          if (result.requiresTwoFactor) {
            navigate('/two-step-verification', { state: { email, mobileNumber: result.mobileNumber } });
          } else {
            onSuccess?.();
            navigate('/home');
          }
        }, 1000);
      } else {
        try {
          notificationService.error('❌ Login Failed', result.error || 'Please check your credentials and try again.');
        } catch (error) {
          // Fallback: simple alert
          alert('❌ Login Failed: ' + (result.error || 'Please check your credentials and try again.'));
        }
      }
    } finally {
      setIsLoading(false);
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
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputWithIcon}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className={styles.options}>
        <label className={styles.remember}>
          <input 
            id="keepLoggedIn" 
            type="checkbox" 
            className={styles.rememberCheckbox}
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
          />
          <span className={styles.rememberText}>Keep me logged in</span>
        </label>
        <a href="/forgot-password" className={styles.forgot}>Forgot Password?</a>
      </div>
      <button 
        type="submit" 
        className={styles.button}
        disabled={isLoading}
      >
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={styles.spinner}></span>
            Signing In...
          </span>
        ) : (
          'Log In'
        )}
      </button>
    </form>
  );
};

