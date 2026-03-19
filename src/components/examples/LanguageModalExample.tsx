import React, { useState } from 'react';
import LanguageSelectionModal from '@/components/common/LanguageSelectionModal';

const LanguageModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedLanguages, setAddedLanguages] = useState<Array<{name: string; code: string; nativeName: string}>>([]);

  const existingLanguageCodes = addedLanguages.map(lang => lang.code);

  const handleAddLanguage = (languageData: { name: string; code: string; nativeName: string }) => {
    setAddedLanguages(prev => [...prev, languageData]);
    console.log('Added language:', languageData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Language Selection Modal Example</h2>
      
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Add Language
      </button>

      {addedLanguages.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Added Languages:</h3>
          <ul>
            {addedLanguages.map((lang, index) => (
              <li key={index}>
                {lang.name} / {lang.nativeName} ({lang.code})
              </li>
            ))}
          </ul>
        </div>
      )}

      <LanguageSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLanguage}
        existingLanguageCodes={existingLanguageCodes}
        title="Add New Language"
      />
    </div>
  );
};

export default LanguageModalExample;
