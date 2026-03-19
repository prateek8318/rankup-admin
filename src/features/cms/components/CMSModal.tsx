import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import styles from '@/styles/features/CMS.module.css';

interface CMSModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  formData: { title: string; key: string; content: string; language: string };
  setFormData: React.Dispatch<React.SetStateAction<{ title: string; key: string; content: string; language: string }>>;
  translatedContent: string;
  setTranslatedContent: (val: string) => void;
  languages: { code: string; name: string }[];
  selectedLanguagesForModal: string[];
  setSelectedLanguagesForModal: React.Dispatch<React.SetStateAction<string[]>>;
  showModalLanguageDropdown: boolean;
  setShowModalLanguageDropdown: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const CMSModal: React.FC<CMSModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  setFormData,
  translatedContent,
  setTranslatedContent,
  languages,
  selectedLanguagesForModal,
  setSelectedLanguagesForModal,
  showModalLanguageDropdown,
  setShowModalLanguageDropdown,
  handleSubmit,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add New CMS Content</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Content Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Privacy Policy, Terms and Conditions"
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Content Key</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., privacy_policy, terms_conditions"
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Languages (Select multiple for auto-translation)</label>
            <div className={styles.dropdownContainer}>
              <button
                type="button"
                onClick={() => setShowModalLanguageDropdown(!showModalLanguageDropdown)}
                className={`${styles.languageSelectButton} ${selectedLanguagesForModal.length > 0 ? styles.languageSelectButtonActive : ''}`}
              >
                <span>
                  {selectedLanguagesForModal.length === 0 
                    ? "Select languages..." 
                    : `${selectedLanguagesForModal.length} language(s) selected`
                  }
                </span>
                <span style={{ fontSize: "12px" }}>▼</span>
              </button>
              
              {showModalLanguageDropdown && (
                <div className={styles.languageDropdownMenu}>
                  {languages.map((lang) => (
                    <div key={lang.code} className={styles.dropdownCheckboxItem}>
                      <input
                        type="checkbox"
                        id={`modal-lang-${lang.code}`}
                        checked={selectedLanguagesForModal.includes(lang.code)}
                        onChange={() => {
                          setSelectedLanguagesForModal(prev => {
                            if (prev.includes(lang.code)) {
                              return prev.filter(code => code !== lang.code);
                            } else {
                              return [...prev, lang.code];
                            }
                          });
                        }}
                        className={styles.dropdownCheckboxInput}
                      />
                      <label 
                        htmlFor={`modal-lang-${lang.code}`} 
                        className={`${styles.dropdownCheckboxLabel} ${selectedLanguagesForModal.includes(lang.code) ? styles.dropdownCheckboxLabelActive : ''}`}
                      >
                        {lang.name}
                      </label>
                    </div>
                  ))}
                  <div className={styles.dropdownFooter}>
                    {selectedLanguagesForModal.length} language(s) selected
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Content</label>
            <div data-color-mode="light">
              <MDEditor
                value={translatedContent || formData.content}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, content: value || '' }));
                  setTranslatedContent(value || '');
                }}
                height={300}
              />
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({ key: '', title: '', content: '', language: 'en' });
                setTranslatedContent('');
                setSelectedLanguagesForModal(['en']);
              }}
              className={styles.modalSecondaryBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.modalPrimaryBtn}>
              Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
