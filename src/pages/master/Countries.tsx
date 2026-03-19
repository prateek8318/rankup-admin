import { useMemo, useState } from 'react';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable from '@/components/common/MasterTable';
import CountryFormModal from '@/features/master/countries/components/CountryFormModal';
import { createCountryTableColumns } from '@/features/master/countries/createCountryTableColumns';
import { useCountries, type CountryLanguage } from '@/features/master/countries/hooks/useCountries';
import { useCountryForm } from '@/features/master/countries/hooks/useCountryForm';
import { filterCountries } from '@/features/master/countries/countryUtils';

const Countries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<CountryLanguage>('en');

  const { countries, deleteCountry, loading, saveCountry } = useCountries(selectedLanguage);
  const {
    autoTranslate,
    editingCountry,
    formData,
    handleNameEnChange,
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
            options: [
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'Hindi' },
            ],
            onChange: (value) => setSelectedLanguage(value as CountryLanguage),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredCountries}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteCountry}
        emptyMessage="No countries found."
        loadingMessage="Loading countries..."
      />

      <CountryFormModal
        isOpen={showModal}
        editingCountry={editingCountry}
        formData={formData}
        autoTranslate={autoTranslate}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onNameEnChange={handleNameEnChange}
        onNameHiChange={(value) => setFormData((prev) => ({ ...prev, nameHi: value }))}
        onCodeChange={(value) => setFormData((prev) => ({ ...prev, code: value }))}
        onAutoTranslateChange={setAutoTranslate}
        onActiveChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
      />
    </>
  );
};

export default Countries;
