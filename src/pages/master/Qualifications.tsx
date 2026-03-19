import { useMemo, useState } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import QualificationFormModal from '@/features/master/qualifications/components/QualificationFormModal';
import { createQualificationTableColumns } from '@/features/master/qualifications/createQualificationTableColumns';
import { useQualificationForm } from '@/features/master/qualifications/hooks/useQualificationForm';
import { filterQualifications } from '@/features/master/qualifications/qualificationUtils';
import { useQualifications } from '@/hooks/useQualifications';

const Qualifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string | undefined>(undefined);

  const {
    qualifications,
    countries,
    languages,
    loading,
    languagesLoading,
    deleteQualification,
    saveQualification,
  } = useQualifications(selectedLanguageFilter);

  const {
    autoTranslate,
    editingQualification,
    formData,
    handleDescriptionChange,
    handleLanguageToggle,
    handleNameChange,
    handleSubmit,
    handleTranslationFieldChange,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    selectedLanguages,
    setAutoTranslate,
    setFormData,
    showModal,
  } = useQualificationForm({ languages, saveQualification });

  const filteredQualifications = useMemo(
    () => filterQualifications(qualifications, searchTerm),
    [qualifications, searchTerm],
  );

  const columns = useMemo(
    () => createQualificationTableColumns(languages),
    [languages],
  );

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search qualifications..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Qualification"
        onAddClick={openCreateModal}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguageFilter ?? null,
            options: languages.map((language) => ({ value: language.code, label: language.name })),
            onChange: (value) => setSelectedLanguageFilter(value as string || undefined),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredQualifications}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteQualification}
        emptyMessage="No qualifications found."
        loadingMessage="Loading qualifications..."
      />

      <QualificationFormModal
        isOpen={showModal}
        editingQualification={editingQualification}
        formData={formData}
        countries={countries}
        languages={languages}
        selectedLanguages={selectedLanguages}
        languagesLoading={languagesLoading}
        autoTranslate={autoTranslate}
        isTranslating={isTranslating}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onCountryChange={(value) => setFormData((prev) => ({ ...prev, countryCode: value }))}
        onLanguageToggle={handleLanguageToggle}
        onAutoTranslateChange={setAutoTranslate}
        onTranslationChange={handleTranslationFieldChange}
      />
    </>
  );
};

export default Qualifications;
