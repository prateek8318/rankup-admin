import React from 'react';

/* ─────────────────────────────────────── types ─ */
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];

  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

/* ─────────────────────────────────── styles ─ */
const wrapperStyle: React.CSSProperties = { marginBottom: 20 };

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: '14px',
  fontWeight: '500',
};

const baseSelectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
};

const helperStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '4px',
};

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#dc2626',
  marginTop: '4px',
};

/* ─────────────────────────────────── component ─ */
const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = 'Choose an option...',
  helperText,
  error,
}) => {
  const selectStyle: React.CSSProperties = {
    ...baseSelectStyle,
    ...(error ? { border: '1px solid #dc2626' } : {}),
    ...(disabled ? { backgroundColor: '#f3f4f6', color: '#6b7280' } : {}),
  };

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle}>
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        style={selectStyle}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && <p style={helperStyle}>{helperText}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default FormSelect;

