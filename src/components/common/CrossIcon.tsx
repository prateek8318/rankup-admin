import React from 'react';

interface CrossIconProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CrossIcon: React.FC<CrossIconProps> = ({
  onClick,
  disabled = false,
  className,
  style,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: '#6b7280',
        padding: '0',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      ×
    </button>
  );
};
