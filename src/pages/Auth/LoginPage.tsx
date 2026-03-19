import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { LoginForm } from '../../features/auth/components/LoginForm';
import loginIllustration from '@/assets/images/login-illustration.png';
import rankupLogo from '@/assets/images/rankup-logo.png';
import styles from './LoginPage.module.css';



const LoginPage: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.left}>
          <img src={loginIllustration} alt="Login" className={styles.leftImage} />
        </div>
        <div className={styles.right}>
          <div className={styles.logoWrapper}>
            <img src={rankupLogo} alt="Rankup" className={styles.logoImage} />
            <h4 className={styles.title}>Log In</h4>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

