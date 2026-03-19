import React from 'react';
import styles from '@/styles/features/Subscriptions.module.css';

interface SubscriptionsHeaderProps {
  setShowCreateModal: (val: boolean) => void;
}

export const SubscriptionsHeader: React.FC<SubscriptionsHeaderProps> = ({
  setShowCreateModal,
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerInner}>
        <div>
          <h1 className={styles.headerTitle}>Subscription Management</h1>
          <p className={styles.headerSubtitle}>Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createPlanBtn}
        >
          + Create Plan
        </button>
      </div>
    </div>
  );
};
