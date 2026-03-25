import { useMemo, useState, useEffect } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import StateFormModal from '@/features/master/states/components/StateFormModal';
import { createStateTableColumns } from '@/features/master/states/createStateTableColumns';
import { useStateForm } from '@/features/master/states/hooks/useStateForm';
import { filterStates } from '@/features/master/states/stateUtils';
import { useStates } from '@/hooks/useStates';
import Loader from '@/components/common/Loader';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { createDeleteConfirmationConfig } from '@/utils/deleteUtils';
import { useLanguageFilterForMasterHeader } from '@/components/common/LanguageFilter';

const States = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | undefined>(undefined);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    states,
    countries,
    languages,
    loading,
    deleteState,
    saveState,
  } = useStates(selectedLanguageId, selectedCountryCode);

  // Use global language filter
  const languageFilter = useLanguageFilterForMasterHeader<number | null>(languages, {
    valueType: 'id',
    initialValue: null,
    includeAll: true,
  });

  // Sync language filter with selectedLanguageId
  useEffect(() => {
    setSelectedLanguageId(languageFilter.selectedValue === null ? undefined : languageFilter.selectedValue);
  }, [languageFilter.selectedValue]);

  const {
    pendingDeleteId,
    pendingDeleteLabel,
    isDeleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation(
    createDeleteConfirmationConfig(
      deleteState,
      (state: any) => state.name || 'State'
    )
  );

  const {
    editingState,
    errors,
    formData,
    handleCountryChange,
    handleLanguageToggle,
    handleNameChange,
    handleCodeChange,
    handleSubmit,
    handleTranslationChange,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    setFormData,
    showModal,
  } = useStateForm({ languages, saveState });

  const filteredStateRows = useMemo(
    () => filterStates(states, searchTerm, languageFilter.selectedValue || undefined),
    [searchTerm, languageFilter.selectedValue, states],
  );

  const columns = useMemo(
    () => createStateTableColumns(countries, languages, languageFilter.selectedValue || undefined),
    [countries, languages, languageFilter.selectedValue],
  );

  return (
    <>
      {loading && <Loader message="Loading states..." />}
      
      <MasterHeader
        searchPlaceholder="Search states..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add State"
        onAddClick={openCreateModal}
        filters={[
          languageFilter.filter,
          {
            key: 'country',
            label: 'Country',
            value: selectedCountryCode || null,
            options: countries.map((country) => ({ value: country.code, label: country.name })),
            onChange: (value) => setSelectedCountryCode(value ? String(value) : ''),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredStateRows}
        loading={false}
        onEdit={openEditModal}
        onDelete={requestDelete}
        emptyMessage="No states found."
        loadingMessage="Loading states..."
      />

      <DeleteConfirmation
        pendingDeleteId={pendingDeleteId}
        pendingDeleteLabel={pendingDeleteLabel}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <StateFormModal
        isOpen={showModal}
        editingState={editingState}
        formData={formData}
        errors={errors}
        countries={countries}
        languages={languages}
        isTranslating={isTranslating}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onNameChange={handleNameChange}
        onCountryChange={handleCountryChange}
        onCodeChange={handleCodeChange}
        onLanguageToggle={handleLanguageToggle}
        onTranslationChange={handleTranslationChange}
        onActiveChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
      />
    </>
  );
};

export default States;
