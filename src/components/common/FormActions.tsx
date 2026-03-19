import React from 'react';

export interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onSubmit,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  disabled = false,
  type = 'submit'
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: 20 }}>
      <button
        type="button"
        onClick={onCancel}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          background: "#fff",
          fontSize: "14px",
          cursor: "pointer",
          color: "#374151"
        }}
      >
        {cancelLabel}
      </button>
      <button
        type={type}
        onClick={type === 'button' ? onSubmit : undefined}
        disabled={disabled}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
          color: "#fff",
          fontSize: "14px",
          cursor: disabled ? "not-allowed" : "pointer",
          border: "none",
          opacity: disabled ? 0.7 : 1
        }}
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default FormActions;

