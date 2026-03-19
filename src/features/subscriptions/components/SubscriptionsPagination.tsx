import React from 'react';
import styles from '../styles/Subscriptions.module.css';

interface SubscriptionsPaginationProps {
  currentPage: number;
  totalPlans: number;
}

export const SubscriptionsPagination: React.FC<SubscriptionsPaginationProps> = ({
  currentPage,
  totalPlans,
}) => {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationText}>
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalPlans)} of {totalPlans} plans
      </div>
      <div className={styles.paginationButtons}>
        <button 
          disabled={currentPage === 1} 
          className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ''}`}
        >
          &lt; Prev
        </button>
        <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>
          {currentPage}
        </button>
        <button 
          disabled={currentPage * 10 >= totalPlans} 
          className={`${styles.pageBtn} ${currentPage * 10 >= totalPlans ? styles.pageBtnDisabled : ''}`}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};
