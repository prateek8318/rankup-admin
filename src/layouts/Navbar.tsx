import ProfileLogo from '@/components/ui/ProfileLogo';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/layouts/AdminShell.module.css';

const Navbar = () => {
  const { auth } = useAuth();
  const userName = auth.user?.name || 'Admin';

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarInner}>
        <div className={styles.navbarProfile}>
          <div className={styles.navbarGreeting}>Hi, {userName}</div>
          <ProfileLogo />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
