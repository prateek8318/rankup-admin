import React from 'react';
import styles from '../styles/Subscriptions.module.css';

interface SubscriptionsFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  examType: string;
  setExamType: (val: string) => void;
  popular: string;
  setPopular: (val: string) => void;
  recommended: string;
  setRecommended: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  fetchData: () => void;
  handleReset: () => void;
}

export const SubscriptionsFilterBar: React.FC<SubscriptionsFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  examType,
  setExamType,
  popular,
  setPopular,
  recommended,
  setRecommended,
  price,
  setPrice,
  fetchData,
  handleReset,
}) => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterInner}>
        <div className={styles.filterControls}>
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.filterInput}
          />
          <select 
            value={examType} 
            onChange={e => setExamType(e.target.value)} 
            className={`${styles.filterSelect} ${styles.filterSelectExam}`}
          >
            <option value="">Exam Type</option>
          </select>
          <select 
            value={popular} 
            onChange={e => setPopular(e.target.value)} 
            className={styles.filterSelect}
          >
            <option value="">Popular</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select 
            value={recommended} 
            onChange={e => setRecommended(e.target.value)} 
            className={styles.filterSelect}
          >
            <option value="">Recommended</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            className={styles.filterSelect}
          >
            <option value="">Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
          <button onClick={fetchData} className={styles.applyBtn}>
            Apply
          </button>
        </div>
        <div className={styles.actionControls}>
          <button onClick={handleReset} className={styles.actionBtn}>Reset</button>
          <button className={styles.actionBtn}>Export</button>
        </div>
      </div>
    </div>
  );
};
