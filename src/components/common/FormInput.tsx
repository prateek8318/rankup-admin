import React from 'react';
import { ValidationConfig } from '@/utils/validationConfig';

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
  minLength?: number;
  min?: number;
  max?: number;
  showCharCount?: boolean;
  validationConfig?: ValidationConfig;

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
  minLength,
  min,
  max,
  showCharCount = false,
  validationConfig,
  labelSuffix,
}) => {
  // Use validationConfig if provided, otherwise fall back to individual props
  const finalConfig = validationConfig || {
    minLength: minLength || 1,
    maxLength: maxLength || 100,
    showCharCount,
    helperText
  };

  const inputValue = typeof value === 'string' ? value : String(value);
  const charCount = inputValue.length;
  const isOverLimit = finalConfig.maxLength && charCount > finalConfig.maxLength;
  const isUnderLimit = finalConfig.minLength && charCount < finalConfig.minLength;
  
  const inputStyle: React.CSSProperties = {
    ...baseInputStyle,
    ...(error || isOverLimit ? { border: '1px solid #dc2626' } : {}),
    ...(readOnly || disabled
      ? { backgroundColor: '#f3f4f6', color: '#6b7280' }
      : {}),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (finalConfig.maxLength && newValue.length > finalConfig.maxLength) {
      return;
    }
    onChange(newValue);
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
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={finalConfig.maxLength}
        minLength={finalConfig.minLength}
        min={min}
        max={max}
        style={inputStyle}
      />
      {finalConfig.helperText && <p style={helperStyle}>{finalConfig.helperText}</p>}
      {error && <p style={errorStyle}>{error}</p>}
      {isOverLimit && <p style={errorStyle}>Maximum {finalConfig.maxLength} characters allowed</p>}
      {isUnderLimit && !error && <p style={errorStyle}>Minimum {finalConfig.minLength} characters required</p>}
      {finalConfig.showCharCount && (finalConfig.maxLength || finalConfig.minLength) && (
        <p style={{
          fontSize: '12px',
          color: isOverLimit ? '#dc2626' : '#6b7280',
          marginTop: '4px',
        }}>
          {charCount}/{finalConfig.maxLength || '∞'} characters
        </p>
      )}
    </div>
  );
};

export default FormInput;

