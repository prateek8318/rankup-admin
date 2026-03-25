import { useMemo, useState } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import QualificationFormModal from '@/features/master/qualifications/components/QualificationFormModal';
import { createQualificationTableColumns } from '@/features/master/qualifications/createQualificationTableColumns';
import { useQualificationForm } from '@/features/master/qualifications/hooks/useQualificationForm';
import { filterQualifications } from '@/features/master/qualifications/qualificationUtils';
import { useQualifications } from '@/hooks/useQualifications';
import Loader from '@/components/common/Loader';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { createDeleteConfirmationConfig } from '@/utils/deleteUtils';

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
    pendingDeleteId,
    pendingDeleteLabel,
    isDeleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation(
    createDeleteConfirmationConfig(
      deleteQualification,
      (qualification: any) => qualification.name || 'Qualification'
    )
  );

  const {
    autoTranslate,
    editingQualification,
    errors,
    formData,
    handleCountryChange,
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
      {loading && <Loader message="Loading qualifications..." />}
      
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
        loading={false}
        onEdit={openEditModal}
        onDelete={requestDelete}
        emptyMessage="No qualifications found."
        loadingMessage="Loading qualifications..."
      />

      <DeleteConfirmation
        pendingDeleteId={pendingDeleteId}
        pendingDeleteLabel={pendingDeleteLabel}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <QualificationFormModal
        isOpen={showModal}
        editingQualification={editingQualification}
        formData={formData}
        errors={errors}
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
        onCountryChange={handleCountryChange}
        onLanguageToggle={handleLanguageToggle}
        onAutoTranslateChange={setAutoTranslate}
        onTranslationChange={handleTranslationFieldChange}
      />
    </>
  );
};

export default Qualifications;
