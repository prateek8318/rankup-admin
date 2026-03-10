import React from 'react';

/* ─────────────────────────────────────── types ─ */
export interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;

  type?: 'text' | 'number' | 'email' | 'password';
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;

  /** Extra content rendered to the right of the label (e.g. a translating indicator). */
  labelSuffix?: React.ReactNode;
}

/* ─────────────────────────────────── styles ─ */
const wrapperStyle: React.CSSProperties = { marginBottom: 20 };

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: '14px',
  fontWeight: '500',
};

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
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
const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  helperText,
  error,
  readOnly = false,
  disabled = false,
  maxLength,
  min,
  max,
  labelSuffix,
}) => {
  const inputStyle: React.CSSProperties = {
    ...baseInputStyle,
    ...(error ? { border: '1px solid #dc2626' } : {}),
    ...(readOnly || disabled
      ? { backgroundColor: '#f3f4f6', color: '#6b7280' }
      : {}),
  };

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle}>
        {label} {required && '*'}
        {labelSuffix}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        min={min}
        max={max}
        style={inputStyle}
      />
      {helperText && <p style={helperStyle}>{helperText}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default FormInput;
