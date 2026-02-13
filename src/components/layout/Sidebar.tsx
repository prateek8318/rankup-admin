// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ width: '256px', background: 'white', borderRight: '1px solid #e5e7eb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 24px 16px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            R
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.025em', color: '#111827' }}>
            ranknup
          </span>
        </div>

        <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Main
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link to="/home" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: isActive('/home') ? '500' : '400',
            color: isActive('/home') ? '#1d4ed8' : '#374151',
            background: isActive('/home') ? '#eff6ff' : 'transparent',
            textDecoration: 'none'
          }}>
            <span style={{ fontSize: '18px' }}>📊</span> Dashboard
          </Link>

          <Link to="/users" style={menuItemStyle}>
            <span style={{ fontSize: '18px' }}>👥</span> Users
          </Link>

          <Link to="/exams-management" style={menuItemStyle}>
            <span style={{ fontSize: '18px' }}>📝</span> Exams Management
          </Link>

          <Link to="/subscriptions" style={menuItemStyle}>
            <span style={{ fontSize: '18px' }}>👑</span> Subscriptions
          </Link>

          <Link to="/coupon" style={{
            ...menuItemStyle,
            background: '#eff6ff',
            color: '#1d4ed8',
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '18px' }}>🎟️</span> Coupon
          </Link>

          <div style={{ ...menuItemStyle, color: '#4b5563', cursor: 'not-allowed' }}>
            <span style={{ fontSize: '18px' }}>🎥</span> Daily Motivational Video
          </div>
        </nav>

        <div style={{ margin: '32px 0 8px', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Others
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link to="/support" style={menuItemStyle}>
            <span style={{ fontSize: '18px' }}>🎧</span> Support
          </Link>

          <div style={dropdownItemStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📈</span> Reports
            </div>
            <span style={{ fontSize: '12px' }}>▼</span>
          </div>

          <div style={dropdownItemStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>⚙️</span> Settings
            </div>
            <span style={{ fontSize: '12px' }}>▼</span>
          </div>

          <div style={dropdownItemStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📄</span> CMS
            </div>
            <span style={{ fontSize: '12px' }}>▼</span>
          </div>

          <Link to="/logout" style={{
            ...menuItemStyle,
            marginTop: '16px',
            color: '#dc2626',
            ':hover': { background: '#fef2f2' }
          }}>
            <span style={{ fontSize: '18px' }}>→</span> Logout
          </Link>
        </nav>
      </div>
    </div>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#374151',
  textDecoration: 'none',
  ':hover': { background: '#f9fafb' }
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#374151',
  cursor: 'pointer',
  ':hover': { background: '#f9fafb' }
};

export default Sidebar;