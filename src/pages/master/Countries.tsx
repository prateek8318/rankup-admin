import { useState, useEffect } from 'react';
import {
  countryApi, languageApi,
  CountryDto, CreateCountryDto, UpdateCountryDto, LanguageDto,
} from '@/services/masterApi';
import { errorHandlingService } from '@/services/errorHandlingService';
import { extractApiData } from '@/utils/apiHelpers';
import { translateText } from '@/utils/translate';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormCheckbox from '@/components/common/FormCheckbox';
import StatusBadge from '@/components/common/StatusBadge';

const Countries = () => {
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryDto | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [formData, setFormData] = useState<CreateCountryDto>({
    name: '', nameEn: '', nameHi: '', code: '',
    subdivisionLabelEn: 'State', subdivisionLabelHi: 'राज्य', isActive: true,
  });

  /* ─── data fetching ─ */
  const fetchCountries = async (language?: string) => {
    try {
      const response = await countryApi.getAll(language);
      setCountries(extractApiData<CountryDto>(response));
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchCountries');
      setCountries([]);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await languageApi.getAll();
      setLanguages(extractApiData<LanguageDto>(response));
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchLanguages');
      setLanguages([]);
    }
  };

  useEffect(() => {
    fetchCountries(selectedLanguage);
    fetchLanguages();
  }, [selectedLanguage]);

  /* ─── handlers ─ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCountry) {
        const updateData: UpdateCountryDto = {
          id: editingCountry.id,
          nameEn: formData.nameEn || formData.name || '',
          nameHi: formData.nameHi || '',
          code: formData.code || '',
          subdivisionLabelEn: formData.subdivisionLabelEn || 'State',
          subdivisionLabelHi: formData.subdivisionLabelHi || 'राज्य',
          isActive: formData.isActive !== undefined ? formData.isActive : true,
        };
        await countryApi.update(editingCountry.id, updateData);
      } else {
        await countryApi.create(formData);
      }
      fetchCountries(selectedLanguage);
      resetForm();
    } catch (error) {
      errorHandlingService.handleError(error, 'saveCountry');
    }
  };

  const handleEdit = (country: CountryDto) => {
    setEditingCountry(country);
    setFormData({
      name: country.nameEn || country.name,
      nameEn: country.nameEn || country.name,
      nameHi: country.nameHi || '',
      code: country.code,
      subdivisionLabelEn: (country as any).subdivisionLabelEn || 'State',
      subdivisionLabelHi: (country as any).subdivisionLabelHi || 'राज्य',
      isActive: country.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this country?')) {
      try {
        await countryApi.updateStatus(id, false);
        fetchCountries(selectedLanguage);
      } catch (error) {
        errorHandlingService.handleError(error, 'deactivateCountry');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', nameEn: '', nameHi: '', code: '',
      subdivisionLabelEn: 'State', subdivisionLabelHi: 'राज्य', isActive: true,
    });
    setEditingCountry(null);
    setShowModal(false);
  };

  const getCountryDisplayName = (country: CountryDto) => {
    if (selectedLanguage === 'hi') return country.nameHi || country.nameEn || country.name;
    return country.nameEn || country.name;
  };

  const handleNameEnChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value, nameEn: value }));
    if (autoTranslate && value.trim()) {
      try {
        const hindiTranslation = await translateText(value, 'hi');
        setFormData((prev) => ({ ...prev, nameHi: hindiTranslation, name: value }));
      } catch (error) {
        ;
      }
    }
  };

  /* ─── table config ─ */
  const filteredCountries = countries.filter(
    (country) =>
      getCountryDisplayName(country).toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    {
      key: 'name', label: 'Name',
      render: (country) => (
        <div>
          <div>{getCountryDisplayName(country)}</div>
          {selectedLanguage === 'en' && country.nameHi && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{country.nameHi}</div>
          )}
          {selectedLanguage === 'hi' && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{country.nameEn}</div>
          )}
        </div>
      ),
    },
    { key: 'code', label: 'Code' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge isActive={row.isActive} /> },
    { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions' },
  ];

  /* ─── render ─ */
  return (
    <>
      <MasterHeader
        searchPlaceholder="Search countries..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Country"
        onAddClick={() => setShowModal(true)}
        filters={[
          {
            key: 'language', label: 'Language', value: selectedLanguage,
            options: [
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिन्दी' },
            ],
            onChange: (value) => setSelectedLanguage(value as 'en' | 'hi'),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredCountries}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No countries found."
        loadingMessage="Loading countries..."
      />

      <MasterModal
        isOpen={showModal}
        title={editingCountry ? 'Edit Country' : 'Add Country'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Country Name (English)"
            value={formData.nameEn || ''}
            onChange={handleNameEnChange}
            required
          />

          <FormInput
            label="Country Name (Hindi)"
            value={formData.nameHi || ''}
            onChange={(val) => setFormData({ ...formData, nameHi: val })}
          />

          <FormInput
            label="Code"
            value={formData.code}
            onChange={(val) => setFormData({ ...formData, code: val })}
            required
          />

          <FormCheckbox
            label="Auto-translate to Hindi"
            checked={autoTranslate}
            onChange={setAutoTranslate}
          />

          <FormCheckbox
            label="Active"
            checked={formData.isActive || false}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />

          <FormActions
            onCancel={resetForm}
            submitLabel={editingCountry ? 'Update' : 'Create'}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default Countries;

