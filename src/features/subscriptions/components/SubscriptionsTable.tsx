import React from 'react';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import viewIcon from '@/assets/icons/view.png';
import ToggleSwitch from '@/components/ToggleSwitch';
import { SubscriptionPlanDto } from '@/services/subscriptionPlansApi';
import { SubscriptionsPagination } from './SubscriptionsPagination';
import styles from '@/styles/features/Subscriptions.module.css';

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
  handleView: (plan: SubscriptionPlanDto) => void;
  handleEdit: (plan: SubscriptionPlanDto) => void;
  handleDelete: (id: number) => void;
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
  handleView,
  handleEdit,
  handleDelete,
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
                    <button onClick={() => handleView(p)} className={styles.iconButton} title="View">
                      <img src={viewIcon} alt="View" style={{ width: 16 }} />
                    </button>
                    <button onClick={() => handleEdit(p)} className={styles.iconButton} title="Edit">
                      <img src={editIcon} alt="Edit" style={{ width: 16 }} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className={styles.iconButton} title="Delete">
                      <img src={deleteIcon} alt="Delete" style={{ width: 16 }} />
                    </button>
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
