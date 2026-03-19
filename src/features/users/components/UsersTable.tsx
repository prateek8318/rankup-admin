import React from 'react';
import styles from '../Users.module.css';
import { User } from '../hooks/useUsers';

interface UsersTableProps {
  loading: boolean;
  users: User[];
  selectedUsers: string[];
  handleSelectAll: () => void;
  handleSelectUser: (userId: string) => void;
  getUserId: (user: User) => string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  loading,
  users,
  selectedUsers,
  handleSelectAll,
  handleSelectUser,
  getUserId,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 2) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getPlan = (_user: User) => 'N/A';
  const getSubsStatus = (user: User) => (user.isActive ? 'Active' : 'Block');

  if (loading) {
    return <div className={styles.loadingText}>Loading users...</div>;
  }

  return (
    <div className={styles.tableResponsive}>
      <table className={styles.usersTable}>
        <thead>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCellCheckbox}>
              <input
                type="checkbox"
                checked={users.length > 0 && selectedUsers.length === users.length}
                onChange={handleSelectAll}
                className={styles.tableCheckbox}
              />
            </th>
            <th className={styles.tableHeadCell}>User ID</th>
            <th className={styles.tableHeadCell}>Name</th>
            <th className={styles.tableHeadCell}>Contact</th>
            <th className={styles.tableHeadCell}>Joined On</th>
            <th className={styles.tableHeadCell}>Plan</th>
            <th className={styles.tableHeadCell}>Last Active</th>
            <th className={styles.tableHeadCell}>Subs. Status</th>
            <th className={styles.tableHeadCell}>Days Left</th>
            <th className={styles.tableHeadCell}>Exams Attempted</th>
            <th className={styles.tableHeadCell}>Total</th>
            <th className={styles.tableHeadCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => {
            const userId = getUserId(user);
            const joinedOn = formatDate(user.createdAt);
            const plan = getPlan(user);
            const lastActive = formatLastActive(user.lastLoginAt);
            const subsStatus = getSubsStatus(user);
            const daysLeft = 'N/A';
            const examsAttempted = 'N/A';
            const total = 'N/A';

            return (
              <tr key={user.id} className={styles.tableBodyRow}>
                <td className={styles.tableBodyCellFirst}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(userId)}
                    onChange={() => handleSelectUser(userId)}
                    className={styles.tableCheckbox}
                  />
                </td>
                <td className={`${styles.tableBodyCell} ${styles.fontWeight500}`}>{userId}</td>
                <td className={`${styles.tableBodyCell} ${styles.fontWeight500}`}>{user.name}</td>
                <td className={styles.tableBodyCell}>
                  <div className={styles.contactEmail}>{user.email || 'N/A'}</div>
                  <div className={styles.contactPhone}>{user.phoneNumber || 'N/A'}</div>
                </td>
                <td className={styles.tableBodyCell}>{joinedOn}</td>
                <td className={styles.tableBodyCell}>{plan}</td>
                <td className={styles.tableBodyCell}>{lastActive}</td>
                <td className={styles.tableBodyCell}>
                  <span
                    className={`${styles.statusBadge} ${
                      subsStatus === 'Active' ? styles.statusActive : styles.statusBlocked
                    }`}
                  >
                    {subsStatus}
                  </span>
                </td>
                <td className={styles.tableBodyCell}>{daysLeft}</td>
                <td className={styles.tableBodyCell}>{examsAttempted}</td>
                <td className={styles.tableBodyCell}>{total}</td>
                <td className={styles.tableBodyCellLast}>
                  <button className={styles.actionButtonEdit}>Edit</button>
                  <button className={styles.actionButtonDelete}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
