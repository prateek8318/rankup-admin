import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/images/rankup-logo.png';
import categoryIcon from '@/assets/icons/category.png';
import cmsIcon from '@/assets/icons/cms.png';
import couponIcon from '@/assets/icons/coupon.png';
import dashboardIcon from '@/assets/icons/dashboard.png';
import examsIcon from '@/assets/icons/exams.png';
import globeIcon from '@/assets/icons/globe.png';
import languageIcon from '@/assets/icons/language.png';
import logoutIcon from '@/assets/icons/logout.png';
import reportsIcon from '@/assets/icons/reports.png';
import settingsIcon from '@/assets/icons/settings.png';
import stateIcon from '@/assets/icons/state.png';
import subscriptionIcon from '@/assets/icons/subscription.png';
import supportIcon from '@/assets/icons/support.png';
import usersIcon from '@/assets/icons/users.png';
import styles from '@/styles/layouts/AdminShell.module.css';

type MenuLinkItem = {
  type: 'link';
  path: string;
  label: string;
  icon: string;
};

type MenuGroupItem = {
  type: 'group';
  key: 'master' | 'reports' | 'settings' | 'cms';
  label: string;
  icon: string;
  children: MenuLinkItem[];
};

type MenuItem = MenuLinkItem | MenuGroupItem;

const mainItems: MenuLinkItem[] = [
  { type: 'link', path: '/home', label: 'Dashboard', icon: dashboardIcon },
  { type: 'link', path: '/home/users', label: 'Users', icon: usersIcon },
  { type: 'link', path: '/home/exams-management', label: 'Exams Management', icon: examsIcon },
  { type: 'link', path: '/home/subscriptions', label: 'Subscriptions', icon: subscriptionIcon },
  { type: 'link', path: '/home/coupon', label: 'Coupon', icon: couponIcon },
];

const otherItems: MenuItem[] = [
  { type: 'link', path: '/home/support', label: 'Support', icon: supportIcon },
  { type: 'group', key: 'reports', label: 'Reports', icon: reportsIcon, children: [] },
  { type: 'group', key: 'settings', label: 'Settings', icon: settingsIcon, children: [] },
  {
    type: 'group',
    key: 'cms',
    label: 'CMS',
    icon: cmsIcon,
    children: [
      { type: 'link', path: '/home/cms', label: 'Content Management', icon: cmsIcon },
    ],
  },
  { type: 'link', path: '/login', label: 'Logout', icon: logoutIcon },
];

const masterItems: MenuGroupItem = {
  type: 'group',
  key: 'master',
  label: 'Master',
  icon: dashboardIcon,
  children: [
    { type: 'link', path: '/home/master/languages', label: 'Languages', icon: languageIcon },
    { type: 'link', path: '/home/master/states', label: 'States', icon: stateIcon },
    { type: 'link', path: '/home/master/countries', label: 'Countries', icon: globeIcon },
    { type: 'link', path: '/home/master/categories', label: 'Categories', icon: categoryIcon },
    { type: 'link', path: '/home/master/qualifications', label: 'Qualifications', icon: categoryIcon },
    { type: 'link', path: '/home/master/streams', label: 'Streams', icon: examsIcon },
    { type: 'link', path: '/home/master/exams', label: 'Exams', icon: examsIcon },
    { type: 'link', path: '/home/master/subjects', label: 'Subjects', icon: categoryIcon },
  ],
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<MenuGroupItem['key'], boolean>>({
    master: false,
    reports: false,
    settings: false,
    cms: false,
  });

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const isActivePath = (path: string) => location.pathname === path;

  const isGroupActive = (group: MenuGroupItem) => (
    group.children.some((child) => location.pathname.startsWith(child.path))
  );

  const groupState = useMemo(
    () => ({
      ...openGroups,
      master: openGroups.master || isGroupActive(masterItems),
      cms: openGroups.cms || isGroupActive(otherItems.find((item): item is MenuGroupItem => item.type === 'group' && item.key === 'cms')!),
    }),
    [location.pathname, openGroups],
  );

  const toggleGroup = (key: MenuGroupItem['key']) => {
    setOpenGroups((previous) => ({
      ...previous,
      [key]: !groupState[key],
    }));
  };

  const renderLink = (item: MenuLinkItem) => {
    const isActive = isActivePath(item.path);

    // Handle logout specially
    if (item.path === '/login') {
      return (
        <button
          key={item.path}
          onClick={handleLogout}
          className={`${styles.menuLink} ${styles.menuLinkButton}`}
        >
          <span className={styles.menuLabel}>
            <img src={item.icon} alt="" className={styles.menuIcon} />
            <span>{item.label}</span>
          </span>
        </button>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
      >
        <span className={styles.menuLabel}>
          <img src={item.icon} alt="" className={styles.menuIcon} />
          <span>{item.label}</span>
        </span>
      </Link>
    );
  };

  const renderGroup = (group: MenuGroupItem) => {
    const isOpen = groupState[group.key];
    const isActive = isGroupActive(group);

    return (
      <div key={group.key}>
        <button
          type="button"
          onClick={() => toggleGroup(group.key)}
          className={`${styles.menuToggle} ${isActive ? styles.menuToggleActive : ''}`}
        >
          <span className={styles.menuLabel}>
            <img src={group.icon} alt="" className={styles.menuIcon} />
            <span>{group.label}</span>
          </span>
          <span
            className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && group.children.length > 0 ? (
          <div className={styles.nestedMenuList}>
            {group.children.map(renderLink)}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarHeaderInner}>
          <img src={logo} alt="RankUp logo" className={styles.logo} />
        </div>
      </div>

      <div className={styles.sidebarBody}>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Main</div>
          <div className={styles.menuList}>
            {mainItems.map(renderLink)}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>Master</div>
          <div className={styles.menuList}>
            {renderGroup(masterItems)}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>Others</div>
          <div className={styles.menuList}>
            {otherItems.map((item) => (item.type === 'link' ? renderLink(item) : renderGroup(item)))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;
