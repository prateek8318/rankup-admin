import { useState } from 'react';
import styles from './States.module.css';
import { useStates } from '@/hooks/useStates';
import { StateDto, CreateStateDto, StateNameDto } from '@/services/masterApi';
import { translateText } from '@/utils/translate';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormCheckbox from '@/components/common/FormCheckbox';
import StatusBadge from '@/components/common/StatusBadge';
import LanguageChecklistPicker from '@/components/common/LanguageChecklistPicker';
const States = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | undefined>(undefined);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingState, setEditingState] = useState<StateDto | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateStateDto>({
    name: '', code: '', countryCode: '', names: [], isActive: true,
  });

  const { states, countries, languages, loading, deleteState, saveState } = useStates(selectedLanguageId, selectedCountryCode);

  /* ─── handlers ─ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveState(formData, editingState);
    if (success) {
      resetForm();
    }
  };

  const handleEdit = (state: StateDto) => {
    setEditingState(state);
    setFormData({
      name: state.name, code: state.code,
      countryCode: state.countryCode,
      names: state.names || [], isActive: state.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await deleteState(id);
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', countryCode: '', names: [], isActive: true });
    setEditingState(null);
    setShowModal(false);
  };

  /* ─── name change with auto-translate ─ */
  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });

    if (formData.names && formData.names.length > 0 && value.trim()) {
      const translateToAllLanguages = async () => {
        setIsTranslating(true);
        try {
          const translatedNames = await Promise.all(
            (formData.names || []).map(async (nameObj) => {
              const language = languages.find((l) => l.id === nameObj.languageId);
              if (language && language.code !== 'en') {
                const translatedName = await translateText(value, language.code);
                return { ...nameObj, name: translatedName };
              }
              return nameObj;
            }),
          );
          setFormData((prev) => ({ ...prev, name: value, names: translatedNames }));
        } finally {
          setIsTranslating(false);
        }
      };
      translateToAllLanguages();
    }
  };

  /* ─── language toggle for translations ─ */
  const handleLanguageToggle = (languageId: number) => {
    const names = formData.names || [];
    const isChecked = names.some((n) => n.languageId === languageId);

    if (isChecked) {
      setFormData({ ...formData, names: names.filter((n) => n.languageId !== languageId) });
    } else {
      const addWithTranslation = async () => {
        setIsTranslating(true);
        try {
          const language = languages.find((l) => l.id === languageId);
          const translatedName = language && language.code !== 'en'
            ? await translateText(formData.name, language.code)
            : formData.name;
          setFormData({
            ...formData,
            names: [...names, { languageId, name: translatedName }],
          });
        } finally {
          setIsTranslating(false);
        }
      };
      addWithTranslation();
    }
  };

  /* ─── helpers ─ */
  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.code === code);
    return country ? `${country.name} (${code})` : code;
  };

  const getLanguageNames = (names: StateNameDto[]) => {
    if (!names || names.length === 0) return '-';
    return names
      .map((name) => {
        const language = languages.find((l) => l.id === name.languageId);
        return language ? `${language.name}: ${name.name}` : name.name;
      })
      .join(', ');
  };

  const getStateDisplayName = (state: StateDto) => {
    if (selectedLanguageId) {
      const nameObj = state.names?.find((n) => n.languageId === selectedLanguageId);
      return nameObj ? nameObj.name : state.name;
    }
    return state.name;
  };

  /* ─── table config ─ */
  const filteredStates = states.filter(
    (state) =>
      getStateDisplayName(state).toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.countryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (state) => getStateDisplayName(state) },
    { key: 'code', label: 'Code' },
    { key: 'countryCode', label: 'Country', render: (state) => getCountryName(state.countryCode) },
    { key: 'languages', label: 'Language', render: (state) => getLanguageNames(state.names) },
    { key: 'status', label: 'Status', render: (state) => <StatusBadge isActive={state.isActive} /> },
    { key: 'createdAt', label: 'Created', render: (state) => new Date(state.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions' },
  ];

  /* ─── render ─ */
  return (
    <>
      <MasterHeader
        searchPlaceholder="Search states..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add State"
        onAddClick={() => setShowModal(true)}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguageId ?? null,
            options: languages.map((l) => ({ value: l.id, label: l.name })),
            onChange: (value) => setSelectedLanguageId(value ? Number(value) : undefined),
          },
          {
            key: 'country',
            label: 'Country',
            value: selectedCountryCode || null,
            options: countries.map((c) => ({ value: c.code, label: c.name })),
            onChange: (value) => setSelectedCountryCode(value ? String(value) : ''),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredStates}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No states found."
        loadingMessage="Loading states..."
      />

      <MasterModal
        isOpen={showModal}
        title={editingState ? 'Edit State' : 'Add State'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            value={formData.name}
            onChange={handleNameChange}
            required
            labelSuffix={
              isTranslating ? (
                <span className={styles.translatingText}>
                  (Translating...)
                </span>
              ) : null
            }
          />

          <FormSelect
            label="Select Country"
            value={formData.countryCode}
            onChange={(val) => setFormData({ ...formData, countryCode: val })}
            options={countries.map((c) => ({ value: c.code, label: `${c.name} (${c.code})` }))}
            required
            placeholder="Choose a country..."
            helperText="Select country from API data. Country code will be auto-filled."
          />

          <FormInput
            label="State Code"
            value={formData.code}
            onChange={(val) => setFormData({ ...formData, code: val.toUpperCase() })}
            required
            placeholder="e.g., BR, MH, UP"
            maxLength={2}
            helperText="2-letter state code (e.g., BR for Bihar)"
          />

          <LanguageChecklistPicker
            label="Select Languages (Multi-Select)"
            languages={languages}
            selectedLanguageIds={(formData.names || []).map((n) => n.languageId)}
            onToggle={handleLanguageToggle}
            disabled={isTranslating}
            helperText="Select multiple languages for state name translations."
          />

          {formData.names && formData.names.length > 0 && (
            <div className={styles.translationSection}>
              <label className={styles.translationLabel}>
                State Names by Language *
              </label>
              {formData.names.map((nameObj, index) => {
                const language = languages.find((l) => l.id === nameObj.languageId);
                return (
                  <div key={nameObj.languageId} className={styles.translationItem}>
                    <label className={styles.translationLangName}>
                      {language?.name || `Language ${nameObj.languageId}`}
                    </label>
                    <input
                      type="text"
                      required
                      value={nameObj.name}
                      onChange={(e) => {
                        const updatedNames = [...formData.names!];
                        updatedNames[index] = { ...nameObj, name: e.target.value };
                        setFormData({ ...formData, names: updatedNames });
                      }}
                      placeholder={`Enter state name in ${language?.name || 'this language'}`}
                      className={styles.translationInput}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <FormCheckbox
            label="Active"
            checked={formData.isActive ?? true}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />

          <FormActions
            onCancel={resetForm}
            submitLabel={editingState ? 'Update' : 'Create'}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default States;

