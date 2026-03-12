import { useState, useEffect } from 'react';
import { languageApi, LanguageDto, CreateLanguageDto, UpdateLanguageDto } from '@/services/masterApi';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormCheckbox from '@/components/common/FormCheckbox';
import StatusBadge from '@/components/common/StatusBadge';
import { LANGUAGE_OPTIONS } from '@/constants/languageOptions';

const Languages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageDto | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | undefined>(undefined);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateLanguageDto>({
    name: '',
    code: '',
    isActive: true,
  });

  /* ─── data fetching ─ */
  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await languageApi.getAll();
      let data = response.data?.data || response.data || [];
      if (!Array.isArray(data)) data = [];
      setLanguages(data);
    } catch (error) {
      ;
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [selectedStatusFilter]);

  /* ─── derived values ─ */
  const availableLanguageOptions = LANGUAGE_OPTIONS.filter(
    (option) =>
      !languages.some((lang) => lang.code.toLowerCase() === option.code.toLowerCase()) ||
      (editingLanguage && editingLanguage.code.toLowerCase() === option.code.toLowerCase()),
  );

  const dropdownOptions = editingLanguage
    ? LANGUAGE_OPTIONS.filter(
        (option) =>
          !languages.some(
            (lang) =>
              lang.code.toLowerCase() === option.code.toLowerCase() &&
              lang.id !== editingLanguage.id,
          ) || editingLanguage.code.toLowerCase() === option.code.toLowerCase(),
      )
    : availableLanguageOptions;

  const isCustomMode =
    formData.code === 'custom' ||
    (!!formData.code &&
      !LANGUAGE_OPTIONS.some((opt) => opt.code === formData.code) &&
      !editingLanguage);

  const isCustomCodeValid =
    !!formData.code &&
    formData.code !== 'custom' &&
    !LANGUAGE_OPTIONS.some((opt) => opt.code.toLowerCase() === formData.code.toLowerCase()) &&
    !languages.some((lang) => lang.code.toLowerCase() === formData.code.toLowerCase());

  const isFormValid = () => {
    if (!formData.name || !formData.code) return false;
    if (isCustomMode && (formData.code === 'custom' || !isCustomCodeValid)) return false;
    return true;
  };

  /* ─── handlers ─ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill all required fields with valid data.');
      return;
    }
    try {
      if (editingLanguage) {
        await languageApi.update(editingLanguage.id, formData as UpdateLanguageDto);
      } else {
        await languageApi.create(formData);
      }
      fetchLanguages();
      resetForm();
    } catch (err) {
      ;
    }
  };

  const handleEdit = (language: LanguageDto) => {
    setEditingLanguage(language);
    setFormData({ name: language.name, code: language.code, isActive: language.isActive });
    setShowModal(true);
  };

  const handleLanguageSelect = (selectedCode: string) => {
    if (selectedCode === 'custom') {
      setFormData({ ...formData, name: '', code: 'custom' });
    } else {
      const selected = LANGUAGE_OPTIONS.find((opt) => opt.code === selectedCode);
      if (selected) {
        setFormData({
          ...formData,
          name: `${selected.name} / ${selected.nativeName}`,
          code: selected.code,
        });
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this language?')) {
      try {
        await languageApi.updateStatus(id, false);
        fetchLanguages();
      } catch (err) {
        ;
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', isActive: true });
    setEditingLanguage(null);
    setShowModal(false);
  };

  /* ─── table config ─ */
  const filteredLanguages = languages.filter(
    (lang) => {
      const matchesSearch = 
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        !selectedStatusFilter || 
        (selectedStatusFilter === 'active' && lang.isActive) ||
        (selectedStatusFilter === 'inactive' && !lang.isActive);
      
      return matchesSearch && matchesStatus;
    }
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge isActive={row.isActive} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    { key: 'actions', label: 'Actions' },
  ];

  /* ─── Select dropdown options for the form ─ */
  const selectOptions = [
    ...dropdownOptions.map((opt) => ({
      value: opt.code,
      label: `${opt.name} (${opt.code})`,
    })),
    ...(!editingLanguage ? [{ value: 'custom', label: '+ Add Custom Language' }] : []),
  ];

  /* ─── render ─ */
  return (
    <>
      <MasterHeader
        searchPlaceholder="Search languages..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Language"
        onAddClick={() => setShowModal(true)}
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: selectedStatusFilter ?? null,
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
            onChange: (value) => setSelectedStatusFilter(value ? String(value) : undefined),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredLanguages}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No languages found."
        loadingMessage="Loading languages..."
      />

      <MasterModal
        isOpen={showModal}
        title={editingLanguage ? 'Edit Language' : 'Add Language'}
      >
        <form onSubmit={handleSubmit}>
          <FormSelect
            label="Select Language"
            value={isCustomMode ? 'custom' : formData.code}
            onChange={handleLanguageSelect}
            options={selectOptions}
            required
            disabled={!!editingLanguage}
            placeholder="Choose a language..."
            helperText={
              editingLanguage
                ? 'Language selection is disabled in edit mode to maintain code consistency.'
                : "Select from predefined languages or choose 'Add Custom Language' for new languages. Native script names will be auto-filled."
            }
          />

          <FormInput
            label="Language Name"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            required
            readOnly={!isCustomMode && !editingLanguage}
            placeholder={
              isCustomMode
                ? "Enter custom language name (e.g., 'Bhojpuri / भोजपुरी')..."
                : 'Language name (auto-filled with native script)'
            }
          />

          <FormInput
            label="Language Code"
            value={formData.code === 'custom' ? '' : formData.code}
            onChange={(val) => setFormData({ ...formData, code: val.toLowerCase() })}
            required
            readOnly={!isCustomMode && !editingLanguage}
            placeholder={
              isCustomMode
                ? "Enter custom language code (e.g., 'bho' for Bhojpuri)..."
                : ''
            }
            helperText={
              isCustomMode
                ? isCustomCodeValid
                  ? '✓ Custom code is available'
                  : '✗ This code already exists (case-insensitive check)'
                : !editingLanguage
                  ? 'Code is auto-generated from language selection above.'
                  : undefined
            }
          />

          <FormCheckbox
            label="Active"
            checked={formData.isActive ?? true}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />

          <FormActions
            onCancel={resetForm}
            submitLabel={editingLanguage ? 'Update' : 'Create'}
            disabled={!isFormValid()}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default Languages;
