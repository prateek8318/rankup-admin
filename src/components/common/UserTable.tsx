import React from 'react';

interface UserTableProps {
  users: any[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  getUserId: (user: any) => string;
  formatDate: (dateString?: string) => string;
  formatLastActive: (dateString?: string) => string;
  getPlan: (user: any) => string;
  getSubsStatus: (user: any) => string;
  currentPage: number;
  totalUsers: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  getUserId,
  formatDate,
  formatLastActive,
  getPlan,
  getSubsStatus,
  currentPage,
  totalUsers,
  totalPages,
  handlePageChange,
}) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', borderWidth: '1px', borderColor: '#C0C0C0' }}>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length}
                onChange={onSelectAll}
                style={{ width: '16px', height: '16px' }}
              />
            </th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>User ID</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Name</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Contact</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Joined On</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Plan</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Last Active</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Subs. Status</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Days Left</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Exams Attempted</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Total</th>
            <th style={{ padding: '16px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userId = getUserId(user);
            const joinedOn = formatDate(user.createdAt);
            const plan = getPlan(user);
            const lastActive = formatLastActive(user.lastLoginAt);
            const subsStatus = getSubsStatus(user);
            const daysLeft = 'N/A';
            const examsAttempted = 'N/A';
            const total = 'N/A';

            return (
              <tr key={user.id} style={{ background: '#f8fafc', borderColor: '#C0C0C0', borderWidth: '1.5px' }}>
                <td style={{ padding: '16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(userId)}
                    onChange={() => onSelectUser(userId)}
                    style={{ width: '16px', height: '16px' }}
                  />
                </td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{userId}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <div style={{ marginBottom: '2px', fontWeight: '500' }}>{user.email || 'N/A'}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>{user.phoneNumber || 'N/A'}</div>
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{joinedOn}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{plan}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{lastActive}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: subsStatus === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: subsStatus === 'Active' ? '#166534' : '#991b1b',
                  }}>
                    {subsStatus}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{daysLeft}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{examsAttempted}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>{total}</td>
                <td style={{ padding: '16px', borderWidth: '1px', borderColor: '#C0C0C0' }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginRight: '8px',
                    fontWeight: '500',
                  }}>
                    Edit
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #f3f4f6',
      }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: currentPage === 1 ? '#f9fafb' : '#fff',
              color: currentPage === 1 ? '#d1d5db' : '#374151',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
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
                style={{
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: currentPage === page ? '#2563eb' : '#fff',
                  color: currentPage === page ? '#fff' : '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {page}
              </button>
            ));
          })()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: currentPage >= totalPages ? '#f9fafb' : '#fff',
              color: currentPage >= totalPages ? '#d1d5db' : '#374151',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
