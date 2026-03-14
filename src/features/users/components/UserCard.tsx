import React from 'react';
import styles from '../Users.module.css';
import usersIcon from '@/assets/icons/user.png';
import activeSubscribersIcon from '@/assets/icons/active-subscribers.png';
import subscribersIcon from '@/assets/icons/subscribers.png';
// Using vector1 fallback if others aren't available, but let's assume they might be imported or just fallback
import vector1Icon from '@/assets/icons/Vector (3).png';
import vector2Icon from '@/assets/icons/Vector (6).png';
import vector3Icon from '@/assets/icons/Vector (5).png';
import vector4Icon from '@/assets/icons/Vector (2).png';
import vector5Icon from '@/assets/icons/Vector (4).png';
import vector6Icon from '@/assets/icons/Vector (6).png';
import vector7Icon from '@/assets/icons/Vector (7).png';
import vector8Icon from '@/assets/icons/Vector (8).png';
import vector9Icon from '@/assets/icons/Vector.png';

interface UserCardProps {
  number: string | number;
  label: string;
  gradient: string;
}

export const UserCard: React.FC<UserCardProps> = ({ number, label, gradient }) => {
  const getIcon = (label: string) => {
    switch (label) {
      case "Total Users": return usersIcon;
      case "Active Subscribers": return activeSubscribersIcon;
      case "Free Users": return subscribersIcon;
      case "New Users (Last 7 Days)": return activeSubscribersIcon;
      case "No Activity (30 days)": return activeSubscribersIcon;
      default: return usersIcon;
    }
  };

  const getVectorIcon = (label: string) => {
    switch (label) {
      case "Total Users": return vector1Icon;
      case "Active Subscribers": return vector2Icon;
      case "Free Users": return vector3Icon;
      case "New Users (Last 7 Days)": return vector4Icon;
      case "No Activity (30 days)": return vector5Icon;
      default: return vector6Icon;
    }
  };

  return (
    <div className={styles.userCard} style={{ background: gradient }}>
      <div className={styles.cardIconContainer}>
        <img src={getIcon(label)} alt="icon" className={styles.cardIcon} />
      </div>
      <div className={styles.cardNumber}>{number}</div>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardVectorContainer}>
        <img src={getVectorIcon(label)} alt="vector" className={styles.cardVector} />
      </div>
    </div>
  );
};
