import React, { useState, useEffect } from 'react';
import MasterModal from './MasterModal';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormActions from './FormActions';
import { LANGUAGE_OPTIONS, LanguageOptionConfig } from '@/constants/languageOptions';

export interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (languageData: { name: string; code: string; nativeName: string }) => void;
  editingLanguage?: {
    name: string;
    code: string;
    nativeName?: string;
  };
  title?: string;
  existingLanguageCodes?: string[];
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingLanguage,
  title = "Add Language",
  existingLanguageCodes = []
}) => {
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('');
  const [languageName, setLanguageName] = useState<string>('');
  const [languageCode, setLanguageCode] = useState<string>('');
  const [nativeName, setNativeName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter out already used languages
  const getAvailableOptions = () => {
    return LANGUAGE_OPTIONS.filter(option => 
      !existingLanguageCodes.includes(option.code) || 
      (editingLanguage && editingLanguage.code === option.code)
    );
  };

  // Initialize form data when editing or modal opens
  useEffect(() => {
    if (editingLanguage) {
      setLanguageName(editingLanguage.name);
      setLanguageCode(editingLanguage.code);
      setNativeName(editingLanguage.nativeName || '');
      setSelectedLanguageCode(editingLanguage.code);
    } else {
      // Reset form for new language
      setLanguageName('');
      setLanguageCode('');
      setNativeName('');
      setSelectedLanguageCode('');
    }
    // Clear errors when modal opens/closes
    setErrors({});
  }, [editingLanguage, isOpen]);

  // Handle language selection from dropdown
  const handleLanguageSelection = (code: string) => {
    setSelectedLanguageCode(code);
    const selectedOption = LANGUAGE_OPTIONS.find(option => option.code === code);
    
    if (selectedOption) {
      setLanguageName(selectedOption.name);
      setLanguageCode(selectedOption.code);
      setNativeName(selectedOption.nativeName);
    }
    // Clear errors when user makes a selection
    setErrors({});
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedLanguageCode) {
      newErrors.languageSelection = 'Please select a language from the dropdown';
    }

    if (!languageName || languageName.trim().length === 0) {
      newErrors.languageName = 'Language name is required';
    }

    if (!languageCode || languageCode.trim().length === 0) {
      newErrors.languageCode = 'Language code is required';
    }

    // Check if language code already exists (only for new languages, not editing)
    if (!editingLanguage && existingLanguageCodes.includes(languageCode)) {
      newErrors.languageCode = 'This language code already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: languageName,
      code: languageCode,
      nativeName: nativeName
    });

    // Reset form
    setLanguageName('');
    setLanguageCode('');
    setNativeName('');
    setSelectedLanguageCode('');
    setErrors({});
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    setLanguageName('');
    setLanguageCode('');
    setNativeName('');
    setSelectedLanguageCode('');
    setErrors({});
    onClose();
  };

  const availableOptions = getAvailableOptions();

  return (
    <MasterModal isOpen={isOpen} title={title} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Language Selection Dropdown */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#374151'
          }}>
            Select Language
          </label>
          <select
            value={selectedLanguageCode}
            onChange={(e) => handleLanguageSelection(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.languageSelection ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="">Choose a language...</option>
            {availableOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name} / {option.nativeName} ({option.code})
              </option>
            ))}
          </select>
          {errors.languageSelection && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.languageSelection}
            </div>
          )}
        </div>

        {/* Auto-filled Language Name */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#374151'
          }}>
            Language Name
          </label>
          <input
            type="text"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            placeholder="Language name will be auto-filled"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.languageName ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#fff',
              boxSizing: 'border-box'
            }}
          />
          {errors.languageName && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.languageName}
            </div>
          )}
        </div>

        {/* Auto-filled Language Code */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#374151'
          }}>
            Language Code
          </label>
          <input
            type="text"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            placeholder="Language code will be auto-filled"
            disabled={!!editingLanguage} // Disable code editing for existing languages
            style={{
              width: '100%',
              padding: '10px 12px',
              border: errors.languageCode ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: editingLanguage ? '#f9fafb' : '#fff',
              boxSizing: 'border-box',
              opacity: editingLanguage ? 0.7 : 1
            }}
          />
          {errors.languageCode && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.languageCode}
            </div>
          )}
        </div>

        {/* Native Name Display */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#374151'
          }}>
            Native Name
          </label>
          <div style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#f9fafb',
            minHeight: '42px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {nativeName || 'Native name will be auto-filled'}
          </div>
        </div>

        {/* Form Actions */}
        <FormActions
          onCancel={handleClose}
          onSubmit={handleSubmit}
          submitLabel={editingLanguage ? 'Update' : 'Add Language'}
          type="button"
        />
      </div>
    </MasterModal>
  );
};

export default LanguageSelectionModal;
