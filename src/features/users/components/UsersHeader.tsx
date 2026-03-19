import React from 'react';
import styles from '../Users.module.css';

interface UsersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.pageTitle}>User Management</h2>
          <p className={styles.pageSubtitle}>
            View and manage all users including their subscriptions & activities
          </p>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
    </div>
  );
};
