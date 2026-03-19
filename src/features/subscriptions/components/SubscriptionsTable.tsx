import React from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';
import { SubscriptionPlanDto } from '@/services/subscriptionPlansApi';
import { SubscriptionsPagination } from './SubscriptionsPagination';
import styles from '../styles/Subscriptions.module.css';

interface SubscriptionsTableProps {
  loading: boolean;
  plans: SubscriptionPlanDto[];
  selectedPlans: string[];
  handleSelectAll: () => void;
  handleSelect: (id: string) => void;
  getPlanId: (p: SubscriptionPlanDto) => string;
  handleTogglePopular: (id: number) => void;
  handleToggleRecommended: (id: number) => void;
  handleToggleActive: (id: number) => void;
  currentPage: number;
  totalPlans: number;
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  loading,
  plans,
  selectedPlans,
  handleSelectAll,
  handleSelect,
  getPlanId,
  handleTogglePopular,
  handleToggleRecommended,
  handleToggleActive,
  currentPage,
  totalPlans,
}) => {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableResponsive}>
        <table className={styles.subsTable}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeadCell}>
                <input 
                  type="checkbox" 
                  checked={selectedPlans.length > 0 && selectedPlans.length === plans.length} 
                  onChange={handleSelectAll} 
                  className={styles.checkbox} 
                />
              </th>
              <th className={styles.tableHeadCell}>Plan ID</th>
              <th className={styles.tableHeadCell}>Name</th>
              <th className={styles.tableHeadCell}>Price</th>
              <th className={styles.tableHeadCell}>Duration</th>
              <th className={styles.tableHeadCell}>Exam Type</th>
              <th className={styles.tableHeadCell}>Popular</th>
              <th className={styles.tableHeadCell}>Recommended</th>
              <th className={styles.tableHeadCell}>Status</th>
              <th className={styles.tableHeadCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => {
              const id = getPlanId(p);
              return (
                <tr key={p.id} className={styles.tableBodyRow}>
                  <td className={styles.tableBodyCell}>
                    <input 
                      type="checkbox" 
                      checked={selectedPlans.includes(id)} 
                      onChange={() => handleSelect(id)} 
                      className={styles.checkbox} 
                    />
                  </td>
                  <td className={styles.tableBodyCellBold}>{id}</td>
                  <td className={styles.tableBodyCellBold}>{p.name}</td>
                  <td className={styles.tableBodyCell}>₹{p.price}</td>
                  <td className={styles.tableBodyCell}>{p.duration} {p.durationType}</td>
                  <td className={styles.tableBodyCell}>{p.examType || 'All Exams'}</td>
                  <td className={styles.tableBodyCell}>
                    <ToggleSwitch 
                      isOn={p.isPopular} 
                      onToggle={() => handleTogglePopular(p.id)} 
                    />
                  </td>
                  <td className={styles.tableBodyCell}>
                    <ToggleSwitch 
                      isOn={p.isRecommended} 
                      onToggle={() => handleToggleRecommended(p.id)} 
                    />
                  </td>
                  <td className={styles.tableBodyCell}>
                    <ToggleSwitch 
                      isOn={p.isActive} 
                      onToggle={() => handleToggleActive(p.id)} 
                    />
                  </td>
                  <td className={styles.tableBodyCell}>
                    <button className={styles.tableActionBtn}>View</button>
                    <button className={styles.tableActionBtn}>Edit</button>
                    <button className={styles.tableActionBtnDanger}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SubscriptionsPagination
        currentPage={currentPage}
        totalPlans={totalPlans}
      />
    </div>
  );
};
