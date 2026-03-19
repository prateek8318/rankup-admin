import React from 'react';
import { FiEdit, FiTrash2, FiArrowLeft, FiGlobe } from 'react-icons/fi';
import MDEditor from '@uiw/react-md-editor';
import { useCMSDetail } from '@/features/cms/hooks/useCMSDetail';
import styles from '@/features/cms/styles/CMS.module.css';

const CMSDetailPage: React.FC = () => {
  const {
    cmsItem,
    loading,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    selectedLanguagesForEdit,
    setSelectedLanguagesForEdit,
    showEditLanguageDropdown,
    setShowEditLanguageDropdown,
    availableLanguages,
    handleUpdate,
    handleTranslate,
    handleDelete,
    navigate
  } = useCMSDetail();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.emptyState}>
          Loading CMS content...
        </div>
      </div>
    );
  }

  if (!cmsItem) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.emptyState}>
          CMS item not found.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainerDetail}>
        {/* HEADER */}
        <div className={styles.actionBarDetail}>
          <div className={styles.actionBarDetailGroup}>
            <button onClick={() => navigate('/home/cms')} className={styles.backButton}>
              <FiArrowLeft /> Back to CMS
            </button>
            <div>
              <h1 className={styles.headerTitleDetail}>{cmsItem.title}</h1>
              <p className={styles.headerSubtitleDetail}>
                Key: {cmsItem.key} | Last updated: {formatDate(cmsItem.updatedAt)}
              </p>
            </div>
          </div>
          
          <div className={styles.actionControls}>
            <button onClick={() => setIsEditing(!isEditing)} className={styles.secondaryButton}>
              <FiEdit /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={handleDelete} className={styles.dangerButton}>
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div className={styles.languageSelectorBar}>
          <div className={styles.languageSelectorLabel}>
            <FiGlobe style={{ fontSize: "18px", color: "#6b7280" }} />
            <span>Languages (Select multiple for auto-translation):</span>
          </div>
          
          <div className={styles.dropdownContainer} style={{ flex: 1 }}>
            <button
              type="button"
              onClick={() => setShowEditLanguageDropdown(!showEditLanguageDropdown)}
              className={`${styles.languageSelectButton} ${selectedLanguagesForEdit.length > 0 ? styles.languageSelectButtonActive : ''}`}
            >
              <span>
                {selectedLanguagesForEdit.length === 0 
                  ? "Select languages..." 
                  : `${selectedLanguagesForEdit.length} language(s) selected`
                }
              </span>
              <span style={{ fontSize: "12px" }}>▼</span>
            </button>
            
            {showEditLanguageDropdown && (
              <div className={styles.languageDropdownMenu}>
                {availableLanguages.map((lang: any) => (
                  <div key={lang.code} className={styles.dropdownCheckboxItem}>
                    <input
                      type="checkbox"
                      id={`edit-lang-${lang.code}`}
                      checked={selectedLanguagesForEdit.includes(lang.code)}
                      onChange={() => {
                        setSelectedLanguagesForEdit(prev => {
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
                      htmlFor={`edit-lang-${lang.code}`} 
                      className={`${styles.dropdownCheckboxLabel} ${selectedLanguagesForEdit.includes(lang.code) ? styles.dropdownCheckboxLabelActive : ''}`}
                    >
                      {lang.name}
                    </label>
                  </div>
                ))}
                <div className={styles.dropdownFooter}>
                  {selectedLanguagesForEdit.length} language(s) selected
                </div>
              </div>
            )}
          </div>
          
          {isEditing && (
            <button onClick={handleTranslate} className={styles.autoTranslateBtn}>
              Auto Translate
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className={styles.cardBlockDetail}>
          {isEditing ? (
            <div>
              <div className={styles.formGroup}>
                <label className={styles.formLabelEditor}>Content Editor</label>
                <div data-color-mode="light">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                    height={400}
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button onClick={() => setIsEditing(false)} className={styles.modalSecondaryBtn}>
                  Cancel
                </button>
                <button onClick={handleUpdate} className={styles.modalPrimaryBtn}>
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className={styles.previewTitle}>Content Preview</h2>
              <div 
                className={styles.previewContent}
                dangerouslySetInnerHTML={{ __html: formData.content || 'No content available' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CMSDetailPage;
