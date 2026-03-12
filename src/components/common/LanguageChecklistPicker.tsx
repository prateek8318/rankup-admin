import React from 'react';

/* ─────────────────────────── types ─ */
export interface LanguageOption {
  id: number;
  name: string;
  code: string;
  nativeName?: string;
}

export interface LanguageChecklistPickerProps {
  label?: string;
  languages: LanguageOption[];
  selectedLanguageIds: number[];
  onToggle: (languageId: number) => void;
  loading?: boolean;
  disabled?: boolean;
  helperText?: string;
  /** Show an auto-translate checkbox above the list. */
  showAutoTranslate?: boolean;
  autoTranslate?: boolean;
  onAutoTranslateChange?: (value: boolean) => void;
}

/* ─────────────────────────── component ─ */
const LanguageChecklistPicker: React.FC<LanguageChecklistPickerProps> = ({
  label = 'Select Languages',
  languages,
  selectedLanguageIds,
  onToggle,
  loading = false,
  disabled = false,
  helperText,
  showAutoTranslate = false,
  autoTranslate = true,
  onAutoTranslateChange,
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <label style={{ fontSize: '14px', fontWeight: '500' }}>{label}</label>

        {showAutoTranslate && onAutoTranslateChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="autoTranslate"
              checked={autoTranslate}
              onChange={(e) => onAutoTranslateChange(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="autoTranslate" style={{ fontSize: '12px', color: '#6b7280' }}>
              Auto-translate
            </label>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 20, fontSize: '14px', color: '#6b7280' }}>
          Loading languages...
        </div>
      ) : (
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: 8,
            maxHeight: 120,
            overflowY: 'auto',
          }}
        >
          {languages.map((language) => (
            <label
              key={language.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 0',
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={selectedLanguageIds.includes(language.id)}
                onChange={() => onToggle(language.id)}
                disabled={disabled}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: '14px' }}>
                {language.name}
                {language.nativeName ? ` (${language.nativeName})` : ''}
              </span>
            </label>
          ))}
        </div>
      )}

      {helperText && (
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: 4 }}>{helperText}</p>
      )}
    </div>
  );
};

export default LanguageChecklistPicker;

