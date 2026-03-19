import React from 'react';
import styles from '../styles/CMS.module.css';

interface CMSPaginationProps {
  currentPage: number;
  totalItems: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const CMSPagination: React.FC<CMSPaginationProps> = ({
  currentPage,
  totalItems,
  setCurrentPage,
}) => {
  if (totalItems <= 10) return null;

  const totalPages = Math.ceil(totalItems / 10);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationText}>
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} items
      </div>
      <div className={styles.paginationButtons}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : styles.pageButtonInactive}`}
        >
          &lt; Prev
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : styles.pageButtonInactive}`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages}
          className={`${styles.pageButton} ${currentPage >= totalPages ? styles.pageButtonDisabled : styles.pageButtonInactive}`}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};
