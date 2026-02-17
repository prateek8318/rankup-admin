import React from 'react';
import ProfileLogo from '../ui/ProfileLogo';
import { useAuth } from '@/features/auth';

const Navbar = () => {
  const { auth } = useAuth();
  const userName = auth.user?.name || 'Admin';
  return (
    <div style={{ background: '#E6F5FF', padding: '5px 18px', borderBottom: '1px solid #E6F5FF' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '420px' }}>
          <img
            src="/src/assets/icons/search.png"
            alt="search"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', opacity: 0.5 }}
          />
          <input
            type="text"
            placeholder="Search here"
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              borderRadius: '999px',
              border: '1px solid #E9F1FF',
              outline: 'none',
              fontSize: '14px',
              background: '#E9F1FF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Hi, {userName}</div>
            <ProfileLogo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
