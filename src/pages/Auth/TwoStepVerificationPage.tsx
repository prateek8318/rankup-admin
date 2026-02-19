import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import inFlag from '@/assets/images/in.png';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0B3EA8 0%, #0A2E82 100%)',
    fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
  },
  card: {
    width: '480px',
    background: '#ffffff',
    borderRadius: '18px',
    padding: '32px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
    textAlign: 'center',
  },
  title: { fontSize: '24px', fontWeight: 700, marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '24px' },
  label: { textAlign: 'left', fontSize: '14px', fontWeight: 600, marginBottom: '6px' },
  mobileInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
  flag: { fontSize: '20px', marginRight: '8px', width: 28, height: 28 },
  verticalLine: { width: 1, height: 24, backgroundColor: '#d1d5db', margin: '0 8px' },
  mobileInput: { border: 'none', outline: 'none', flex: 1, fontSize: '16px' },
  resend: { textAlign: 'right', fontSize: '14px', color: '#2563eb', cursor: 'pointer', marginBottom: '10px' },
  timer: { fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  mobileText: { fontWeight: 600, marginBottom: '16px' },
  countdown: { color: '#f59e0b', fontWeight: '600' },
  otpContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '20px',
    textAlign: 'center',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(135deg, #2B5DBC 0%, #073081 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonDisabled: { cursor: 'not-allowed' },
};

type LocationState = { email?: string; mobileNumber?: string };

const TwoStepVerificationPage: React.FC = () => {
  const location = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  if (!location.state?.email) {
    return <Navigate to="/login" replace />;
  }

  const mobile = location.state?.mobileNumber || '+91 *****3210';
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
    else alert('Invalid OTP');
    setVerifying(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>2 Step Authentication</div>
        <div style={styles.subtitle}>We have Sent A verification code to mobile number whenever you Login in your account</div>
        <div style={styles.label}>Enter Mobile Number</div>
        <div style={styles.mobileInputWrapper}>
          <img src={inFlag} alt="IN" style={styles.flag} onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' fill='%23FF9933'/%3E%3C/svg%3E"; }} />
          <div style={styles.verticalLine} />
          <input value={mobile} style={styles.mobileInput} readOnly />
        </div>
        <div style={styles.resend}>Re-send</div>
        <div style={styles.timer}>Didn't receive OTP SMS?<br />Send OTP again in <span style={styles.countdown}>{formatTime(countdown)} sec</span></div>
        <div style={{ fontSize: 14 }}>Enter verification code we have sent to</div>
        <div style={styles.mobileText}>{mobile}</div>
        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              style={styles.otpInput}
            />
          ))}
        </div>
        <button
          style={{ ...styles.button, ...(verifying || !isComplete ? styles.buttonDisabled : {}) }}
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
