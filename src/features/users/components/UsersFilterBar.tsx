import React from 'react';
import styles from '../Users.module.css';
import exportIcon from '@/assets/icons/export.png';

interface UsersFilterBarProps {
  filters: { userType: string; status: string; time: string };
  setFilters: React.Dispatch<React.SetStateAction<{ userType: string; status: string; time: string }>>;
  handleReset: () => void;
  handleExport: () => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
}

export const UsersFilterBar: React.FC<UsersFilterBarProps> = ({
  filters,
  setFilters,
  handleReset,
  handleExport,
  selectedCount,
  totalCount,
  onSelectAll,
}) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label className={styles.manageLabel}>
            <input
              type="checkbox"
              checked={selectedCount > 0 && selectedCount === totalCount}
              onChange={onSelectAll}
              className={styles.manageCheckbox}
            />
            <span className={styles.manageText}>Manage</span>
          </label>

          <select
            value={filters.userType}
            onChange={(e) => setFilters((prev) => ({ ...prev, userType: e.target.value }))}
            className={styles.filterSelect}
          >
            <option>All Users</option>
            <option>Premium Users</option>
            <option>Free Users</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className={styles.filterSelect}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Block</option>
          </select>

          <select
            value={filters.time}
            onChange={(e) => setFilters((prev) => ({ ...prev, time: e.target.value }))}
            className={styles.filterSelect}
          >
            <option>All Time</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>

          <select className={styles.filterSelect}>
            <option>Bulk Actions</option>
            <option>Delete Selected</option>
            <option>Block Selected</option>
            <option>Export Selected</option>
          </select>
        </div>

        <div className={styles.actionsGroup}>
          <button onClick={handleReset} className={styles.resetButton}>
            Reset
          </button>
          <button onClick={handleExport} className={styles.exportButton}>
            <img src={exportIcon} alt="Export" className={styles.exportIcon} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
