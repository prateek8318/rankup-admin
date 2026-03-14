import React from 'react';
import styles from '../Users.module.css';

interface UsersPaginationProps {
  currentPage: number;
  totalUsers: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const UsersPagination: React.FC<UsersPaginationProps> = ({
  currentPage,
  totalUsers,
  totalPages,
  handlePageChange,
}) => {
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationText}>
        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
      </div>
      <div className={styles.paginationButtons}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : styles.pageButtonInactive}`}
        >
          &lt; Prev
        </button>

        {(() => {
          const maxVisiblePages = 5;
          let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }

          const pages = [];
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
          return pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : styles.pageButtonInactive}`}
            >
              {page}
            </button>
          ));
        })()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${styles.pageButton} ${currentPage >= totalPages ? styles.pageButtonDisabled : styles.pageButtonInactive}`}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};
