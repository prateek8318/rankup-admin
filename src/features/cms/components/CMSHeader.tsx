import React from 'react';
import { FiPlus, FiFilter } from 'react-icons/fi';
import styles from '@/styles/features/CMS.module.css';

interface CMSHeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  showLanguageFilter: boolean;
  setShowLanguageFilter: (val: boolean) => void;
  selectedLanguagesFilter: string[];
  languages: { code: string; name: string }[];
  handleLanguageFilterToggle: (code: string) => void;
  clearLanguageFilter: () => void;
  setIsModalOpen: (val: boolean) => void;
}

export const CMSHeader: React.FC<CMSHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  showLanguageFilter,
  setShowLanguageFilter,
  selectedLanguagesFilter,
  languages,
  handleLanguageFilterToggle,
  clearLanguageFilter,
  setIsModalOpen,
}) => {
  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        <h1 className={styles.headerTitle}>Content Management System</h1>
        <p className={styles.headerSubtitle}>
          Manage website content, privacy policy, terms and conditions
        </p>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.filterControls}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CMS content..."
            className={styles.searchInput}
          />
          
          <div className={styles.dropdownContainer}>
            <button
              onClick={() => setShowLanguageFilter(!showLanguageFilter)}
              className={`${styles.filterButton} ${selectedLanguagesFilter.length > 0 ? styles.filterButtonActive : ''}`}
            >
              <FiFilter /> Language {selectedLanguagesFilter.length > 0 && `(${selectedLanguagesFilter.length} selected)`}
            </button>
            
            {showLanguageFilter && (
              <div className={styles.languageDropdownMenu}>
                <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                  Select Languages (Multiple Selection):
                </div>
                {languages.map((lang) => (
                  <div key={lang.code} className={styles.dropdownCheckboxItem}>
                    <input
                      type="checkbox"
                      id={`lang-${lang.code}`}
                      checked={selectedLanguagesFilter.includes(lang.code)}
                      onChange={() => handleLanguageFilterToggle(lang.code)}
                      className={styles.dropdownCheckboxInput}
                    />
                    <label 
                      htmlFor={`lang-${lang.code}`} 
                      className={styles.dropdownCheckboxLabel}
                    >
                      {lang.name}
                    </label>
                  </div>
                ))}
                {selectedLanguagesFilter.length > 0 && (
                  <button onClick={clearLanguageFilter} className={styles.clearFilterBtn}>
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionControls}>
          <button onClick={() => setIsModalOpen(true)} className={styles.primaryButton}>
            <FiPlus /> Add New Content
          </button>
        </div>
      </div>
    </>
  );
};
