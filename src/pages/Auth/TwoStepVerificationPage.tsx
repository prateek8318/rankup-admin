import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from "@/services/notificationService";
import { authApi } from '@/features/auth/services/authApi';
import inFlag from '@/assets/images/in.png';

import styles from '@/styles/auth/TwoStepVerificationPage.module.css';

type LocationState = { email?: string; mobileNumber?: string };

const TwoStepVerificationPage: React.FC = () => {
  const location = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  if (!location.state?.email) {
    return <Navigate to="/login" replace />;
  }

  const mobile = location.state?.mobileNumber || '+91 9876543210';
  const email = location.state?.email || '';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30); // Changed from 60 to 30 seconds
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string>('');
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0 && !isExpired) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isExpired) {
      setIsExpired(true);
    }
  }, [countdown, isExpired]);

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user starts typing
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const isComplete = otp.every((d) => d !== '');

  const handleResendOTP = async () => {
    if (!email) return;
    
    setResending(true);
    try {
      // Use the same verify-otp endpoint with empty OTP to trigger resend
      await authApi.verifyOTP(email, '');
      notificationService.success('OTP resent successfully');
      setCountdown(30);
      setIsExpired(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch (error) {
      notificationService.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!isComplete) return;
    
    setVerifying(true);
    setError('');
    
    try {
      const { success, error: errorMessage } = await verifyOTP(otp.join(''));
      if (success) {
        navigate('/home');
      } else {
        setError(errorMessage || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>2 Step Authentication</div>
        <div className={styles.subtitle}>We have Sent A verification code to mobile number whenever you Login in your account</div>
        <div className={styles.mobileText}>Enter Mobile Number</div>
        <div className={styles.mobileInputWrapper}>
          <img src={inFlag} alt="IN" className={styles.flag} onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' fill='%23FF9933'/%3E%3C/svg%3E"; }} />
          <div className={styles.verticalLine} />
          <input value={mobile} className={styles.mobileInput} readOnly />
        </div>

        {/* Error Message Display */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Timer and Resend Section */}
        <div className={styles.timerSection}>
          {!isExpired ? (
            <div className={styles.timer}>
              Didn't receive OTP SMS?<br />
              Send OTP again in <span className={styles.countdown}>{formatTime(countdown)} sec</span>
            </div>
          ) : (
            <div className={styles.resendSection}>
              <span className={styles.expiredMessage}>OTP has expired</span>
              <button 
                className={styles.resendButton}
                onClick={handleResendOTP}
                disabled={resending}
              >
                {resending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          )}
        </div>
        <div style={{ fontSize: 14 }}>Enter verification code we have sent to</div>
        <div className={styles.mobileText}>{mobile}</div>
        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className={styles.otpInput}
            />
          ))}
        </div>
        <button
          className={`${styles.button} ${(!isComplete || verifying) ? styles.buttonDisabled : ''}`}
          disabled={!isComplete || verifying}
          onClick={handleVerify}
        >
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
};

export default TwoStepVerificationPage;

