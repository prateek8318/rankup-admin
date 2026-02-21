import React from 'react';
import onIcon from '@/assets/icons/on.png';
import offIcon from '@/assets/icons/off.png';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, disabled = false }) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        width: 40,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src={isOn ? onIcon : offIcon}
        alt={isOn ? 'On' : 'Off'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: disabled ? 0.5 : 1
        }}
      />
    </button>
  );
};

export default ToggleSwitch;
