import { useMemo, useState } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import StateFormModal from '@/features/master/states/components/StateFormModal';
import { createStateTableColumns } from '@/features/master/states/createStateTableColumns';
import { useStateForm } from '@/features/master/states/hooks/useStateForm';
import { filterStates } from '@/features/master/states/stateUtils';
import { useStates } from '@/hooks/useStates';
import Loader from '@/components/common/Loader';

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
    () => filterStates(states, searchTerm, selectedLanguageId),
    [searchTerm, selectedLanguageId, states],
  );

  const columns = useMemo(
    () => createStateTableColumns(countries, languages, selectedLanguageId),
    [countries, languages, selectedLanguageId],
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
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguageId ?? null,
            options: languages.map((language) => ({ value: language.id, label: language.name })),
            onChange: (value) => setSelectedLanguageId(value ? Number(value) : undefined),
          },
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
        onDelete={(item) => deleteState(item.id)}
        emptyMessage="No states found."
        loadingMessage="Loading states..."
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
