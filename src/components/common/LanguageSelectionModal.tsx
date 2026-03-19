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
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedLanguageCode) {
      alert('Please select a language from the dropdown');
      return;
    }
    
    if (!languageName || !languageCode) {
      alert('Language name and code are required');
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
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    setLanguageName('');
    setLanguageCode('');
    setNativeName('');
    setSelectedLanguageCode('');
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
              border: '1px solid #d1d5db',
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
        </div>

        {/* Auto-filled Language Name */}
        <FormInput
          label="Language Name"
          value={languageName}
          onChange={(value) => setLanguageName(value)}
          placeholder="Language name will be auto-filled"
          required
        />

        {/* Auto-filled Language Code */}
        <FormInput
          label="Language Code"
          value={languageCode}
          onChange={(value) => setLanguageCode(value)}
          placeholder="Language code will be auto-filled"
          required
          disabled={!!editingLanguage} // Disable code editing for existing languages
        />

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
