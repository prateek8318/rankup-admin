import React from 'react';
import { useCMSList } from '@/features/cms/hooks/useCMSList';
import { CMSHeader } from '@/features/cms/components/CMSHeader';
import { CMSTable } from '@/features/cms/components/CMSTable';
import { CMSPagination } from '@/features/cms/components/CMSPagination';
import { CMSModal } from '@/features/cms/components/CMSModal';
import styles from '@/features/cms/styles/CMS.module.css';

const CMSManagement: React.FC = () => {
  const {
    cmsItems,
    loading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalItems,
    selectedLanguagesForModal,
    setSelectedLanguagesForModal,
    showModalLanguageDropdown,
    setShowModalLanguageDropdown,
    translatedContent,
    setTranslatedContent,
    languages,
    selectedLanguagesFilter,
    showLanguageFilter,
    setShowLanguageFilter,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleLanguageFilterToggle,
    clearLanguageFilter,
  } = useCMSList();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <CMSHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showLanguageFilter={showLanguageFilter}
          setShowLanguageFilter={setShowLanguageFilter}
          selectedLanguagesFilter={selectedLanguagesFilter}
          languages={languages}
          handleLanguageFilterToggle={handleLanguageFilterToggle}
          clearLanguageFilter={clearLanguageFilter}
          setIsModalOpen={setIsModalOpen}
        />

        <div className={styles.cardBlock}>
          <CMSTable
            loading={loading}
            cmsItems={cmsItems}
            languages={languages}
            handleToggleStatus={handleToggleStatus}
            handleDelete={handleDelete}
          />
          <CMSPagination
            currentPage={currentPage}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <CMSModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          translatedContent={translatedContent}
          setTranslatedContent={setTranslatedContent}
          languages={languages}
          selectedLanguagesForModal={selectedLanguagesForModal}
          setSelectedLanguagesForModal={setSelectedLanguagesForModal}
          showModalLanguageDropdown={showModalLanguageDropdown}
          setShowModalLanguageDropdown={setShowModalLanguageDropdown}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CMSManagement;
