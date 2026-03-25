import { useMemo, useState, useEffect } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import CountryFormModal from '@/features/master/countries/components/CountryFormModal';
import { createCountryTableColumns } from '@/features/master/countries/createCountryTableColumns';
import { useCountries, type CountryLanguage } from '@/features/master/countries/hooks/useCountries';
import { useCountryForm } from '@/features/master/countries/hooks/useCountryForm';
import { filterCountries } from '@/features/master/countries/countryUtils';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { createDeleteConfirmationConfig } from '@/utils/deleteUtils';
import { useLanguageFilterForMasterHeader } from '@/components/common/LanguageFilter';

const Countries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<CountryLanguage>('en');

  const { countries, deleteCountry, loading, saveCountry } = useCountries(selectedLanguage);

  // Create language filter for Countries
  const languageFilterOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
  ];

  const {
    pendingDeleteId,
    pendingDeleteLabel,
    isDeleting,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation(
    createDeleteConfirmationConfig(
      deleteCountry,
      (country: any) => country.name || country.nameEn || 'Country'
    )
  );
  const {
    autoTranslate,
    editingCountry,
    errors,
    formData,
    handleNameEnChange,
    handleNameHiChange,
    handleCodeChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    setFormData,
    showModal,
  } = useCountryForm({ saveCountry });

  const filteredCountries = useMemo(
    () => filterCountries(countries, searchTerm, selectedLanguage),
    [countries, searchTerm, selectedLanguage],
  );

  const columns = useMemo(
    () => createCountryTableColumns(selectedLanguage),
    [selectedLanguage],
  );

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search countries..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Country"
        onAddClick={openCreateModal}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguage,
            options: languageFilterOptions,
            onChange: (value) => setSelectedLanguage(value as CountryLanguage),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredCountries}
        loading={loading}
        onEdit={openEditModal}
        onDelete={requestDelete}
        emptyMessage="No countries found."
        loadingMessage="Loading countries..."
      />

      <DeleteConfirmation
        pendingDeleteId={pendingDeleteId}
        pendingDeleteLabel={pendingDeleteLabel}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <CountryFormModal
        isOpen={showModal}
        editingCountry={editingCountry}
        formData={formData}
        errors={errors}
        autoTranslate={autoTranslate}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onNameEnChange={handleNameEnChange}
        onNameHiChange={handleNameHiChange}
        onCodeChange={handleCodeChange}
        onAutoTranslateChange={setAutoTranslate}
        onActiveChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
      />
    </>
  );
};

export default Countries;
