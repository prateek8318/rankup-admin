import React from 'react';

/* ─────────────────────────────────────── types ─ */
export interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/* ─────────────────────────────────── component ─ */
const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => (
  <div style={{ marginBottom: 20 }}>
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{ width: '16px', height: '16px' }}
      />
      {label}
    </label>
  </div>
);

export default FormCheckbox;
