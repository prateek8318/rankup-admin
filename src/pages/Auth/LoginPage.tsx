import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { LoginForm } from '../../features/auth/components/LoginForm';
import loginIllustration from '@/assets/images/login-illustration.png';
import rankupLogo from '@/assets/images/rankup-logo.png';

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #052B76 0%, #0950DC 100%)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
  leftImage: { maxWidth: '420px', width: '100%', height: 'auto', objectFit: 'contain' as const },
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
  logoImage: { height: '72px', width: 'auto', marginBottom: '8px' },
  title: { fontSize: '22px', fontWeight: 700, color: '#111827' },
};

const LoginPage: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.left}>
          <img src={loginIllustration} alt="Login" style={styles.leftImage} />
        </div>
        <div style={styles.right}>
          <div style={styles.logoWrapper}>
            <img src={rankupLogo} alt="Rankup" style={styles.logoImage} />
            <h4 style={styles.title}>Log In</h4>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
