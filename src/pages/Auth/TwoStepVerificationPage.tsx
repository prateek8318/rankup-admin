import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import inFlag from '@/assets/images/in.png';

import styles from './TwoStepVerificationPage.module.css';

type LocationState = { email?: string; mobileNumber?: string };

const TwoStepVerificationPage: React.FC = () => {
  const location = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  if (!location.state?.email) {
    return <Navigate to="/login" replace />;
  }

  const mobile = location.state?.mobileNumber || '+91 9876543210';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const isComplete = otp.every((d) => d !== '');

  const handleVerify = async () => {
    if (!isComplete) return;
    setVerifying(true);
    const { success } = await verifyOTP(otp.join(''));
    if (success) navigate('/home');
    else toast.error('Invalid OTP');
    setVerifying(false);
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
        <div className={styles.resend}>Re-send</div>
        <div className={styles.timer}>Didn't receive OTP SMS?<br />Send OTP again in <span className={styles.countdown}>{formatTime(countdown)} sec</span></div>
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
