import React from 'react';

export interface StatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}) => (
  <span
    style={{
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: isActive ? '#dcfce7' : '#fee2e2',
      color: isActive ? '#166534' : '#991b1b',
    }}
  >
    {isActive ? activeLabel : inactiveLabel}
  </span>
);

export default StatusBadge;
