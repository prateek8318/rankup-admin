import React from 'react';

/* ─────────────────────────────────────── types ─ */
export interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;

  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  rows?: number;
}

/* ─────────────────────────────────── styles ─ */
const wrapperStyle: React.CSSProperties = { marginBottom: 20 };

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontSize: '14px',
  fontWeight: '500',
};

const baseTextareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  resize: 'vertical',
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
const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  helperText,
  error,
  rows = 3,
}) => {
  const textareaStyle: React.CSSProperties = {
    ...baseTextareaStyle,
    ...(error ? { border: '1px solid #dc2626' } : {}),
  };

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle}>
        {label} {required && '*'}
      </label>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={textareaStyle}
      />
      {helperText && <p style={helperStyle}>{helperText}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default FormTextarea;

