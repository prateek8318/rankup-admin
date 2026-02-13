import React from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import ProfileLogo from '../common/ProfileLogo';

const Navbar = () => {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left side - empty or could have logo */}
        <div></div>

        {/* Right side - profile section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Notification icon */}
          <button style={{
            background: 'white',
            border: 'none',
            fontSize: '24px',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px'
          }}>
            <IoMdNotificationsOutline />
          </button>

          {/* Profile section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Profile text */}
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.2'
              }}>
                Amit Kumar
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                lineHeight: '1.2'
              }}>
                Admin
              </div>
            </div>

            {/* Profile image */}
            <ProfileLogo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;