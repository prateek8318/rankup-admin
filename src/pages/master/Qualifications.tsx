import { useState, useEffect } from 'react';
import { qualificationApi, mockCountries } from '@/services/qualificationApi';
import { languageApi } from '@/services/masterApi';
import {
  QualificationDto, CreateQualificationDto,
  QualificationName, LanguageDto, CountryDto,
} from '@/types/qualification';
import { extractApiData } from '@/utils/apiHelpers';
import { translateText } from '@/utils/translate';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import FormSelect from '@/components/common/FormSelect';
import StatusBadge from '@/components/common/StatusBadge';
import LanguageChecklistPicker from '@/components/common/LanguageChecklistPicker';

const Qualifications = () => {
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [countries] = useState<CountryDto[]>(mockCountries);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQualification, setEditingQualification] = useState<QualificationDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState<CreateQualificationDto>({
    name: '', description: '', countryCode: '', names: [],
  });

  /* ─── data fetching ─ */
  useEffect(() => {
    fetchQualifications();
    fetchLanguages();
  }, [selectedLanguageFilter]);

  const fetchQualifications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedLanguageFilter) params.language = selectedLanguageFilter;
      const data = await qualificationApi.getAllQualifications(params);
      setQualifications(data);
    } catch (error) {
      ;
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      setLanguages(extractApiData<LanguageDto>(response));
    } catch (error) {
      ;
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  /* ─── language toggle with auto-translate ─ */
  const handleLanguageToggle = (languageId: number) => {
    const names = formData.names || [];
    const isCurrentlySelected = selectedLanguages.includes(languageId);

    if (isCurrentlySelected) {
      setSelectedLanguages((prev) => prev.filter((id) => id !== languageId));
      setFormData({ ...formData, names: names.filter((n) => n.languageId !== languageId) });
    } else {
      setSelectedLanguages((prev) => [...prev, languageId]);

      const addLanguageWithTranslation = async () => {
        setIsTranslating(true);
        try {
          const language = languages.find((l) => l.id === languageId);
          if (language) {
            const translatedName = language.code === 'en'
              ? formData.name
              : await translateText(formData.name, language.code);
            const translatedDescription = language.code === 'en'
              ? formData.description
              : await translateText(formData.description, language.code);
            setFormData({
              ...formData,
              names: [...names, { languageId, name: translatedName, description: translatedDescription }],
            });
          }
        } finally {
          setIsTranslating(false);
        }
      };

      if (autoTranslate && formData.name && formData.description) {
        addLanguageWithTranslation();
      } else {
        setFormData({
          ...formData,
          names: [...names, { languageId, name: formData.name, description: formData.description }],
        });
      }
    }
  };

  /* ─── auto-translate on name change ─ */
  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    if (formData.names && formData.names.length > 0 && value.trim()) {
      const translateAll = async () => {
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
      translateAll();
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData({ ...formData, description: value });
    if (formData.names && formData.names.length > 0 && value.trim()) {
      const translateAll = async () => {
        setIsTranslating(true);
        try {
          const translatedDescriptions = await Promise.all(
            (formData.names || []).map(async (nameObj) => {
              const language = languages.find((l) => l.id === nameObj.languageId);
              if (language && language.code !== 'en') {
                const translatedDescription = await translateText(value, language.code);
                return { ...nameObj, description: translatedDescription };
              }
              return nameObj;
            }),
          );
          setFormData((prev) => ({ ...prev, description: value, names: translatedDescriptions }));
        } finally {
          setIsTranslating(false);
        }
      };
      translateAll();
    }
  };

  /* ─── CRUD handlers ─ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.countryCode) {
      alert('Please fill all required fields');
      return;
    }
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language');
      return;
    }
    try {
      if (editingQualification) {
        await qualificationApi.updateQualification(editingQualification.id.toString(), {
          ...formData, id: editingQualification.id,
        });
      } else {
        await qualificationApi.createQualification(formData);
      }
      fetchQualifications();
      resetForm();
      setShowModal(false);
    } catch (error) {
      ;
      alert('Failed to save qualification');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', countryCode: '', names: [] });
    setSelectedLanguages([]);
    setEditingQualification(null);
  };

  const handleEdit = (qualification: QualificationDto) => {
    setEditingQualification(qualification);
    setFormData({
      name: qualification.name, description: qualification.description,
      countryCode: qualification.countryCode, names: qualification.names,
    });
    setSelectedLanguages(qualification.names.map((n) => n.languageId));
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this qualification?')) {
      try {
        await qualificationApi.toggleQualificationStatus(id.toString(), false);
        fetchQualifications();
      } catch (error) {
        ;
      }
    }
  };

  /* ─── table config ─ */
  const filteredQualifications = qualifications.filter(
    (q) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'countryCode', label: 'Country' },
    {
      key: 'languages', label: 'Languages',
      render: (q) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {q.names.map((name: QualificationName) => {
            const language = languages.find((l) => l.id === name.languageId);
            return (
              <span
                key={name.languageId}
                style={{
                  padding: '2px 6px', background: '#dbeafe', color: '#1e40af',
                  borderRadius: 8, fontSize: '12px', fontWeight: '500',
                }}
              >
                {language?.name || name.languageCode || name.languageId}
              </span>
            );
          })}
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge isActive={row.isActive} /> },
    { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions' },
  ];

  /* ─── render ─ */
  return (
    <>
      <MasterHeader
        searchPlaceholder="Search qualifications..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Qualification"
        onAddClick={() => { resetForm(); setShowModal(true); }}
        filters={[
          {
            key: 'language', label: 'Language',
            value: selectedLanguageFilter ?? null,
            options: languages.map((l) => ({ value: l.code, label: l.name })),
            onChange: (value) => setSelectedLanguageFilter(value as string || undefined),
          },
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredQualifications}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No qualifications found."
        loadingMessage="Loading qualifications..."
      />

      <MasterModal
        isOpen={showModal}
        title={editingQualification ? 'Edit Qualification' : 'Add Qualification'}
        width={600}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            value={formData.name}
            onChange={handleNameChange}
            required
            labelSuffix={
              isTranslating ? (
                <span style={{ marginLeft: 8, fontSize: '12px', color: '#6b7280' }}>(Translating...)</span>
              ) : null
            }
          />

          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={handleDescriptionChange}
            required
          />

          <FormSelect
            label="Select Country"
            value={formData.countryCode}
            onChange={(val) => setFormData({ ...formData, countryCode: val })}
            options={countries.map((c) => ({ value: c.code, label: `${c.name} (${c.code})` }))}
            required
            placeholder="Choose a country..."
          />

          <LanguageChecklistPicker
            label="Select Languages *"
            languages={languages}
            selectedLanguageIds={selectedLanguages}
            onToggle={handleLanguageToggle}
            loading={languagesLoading}
            disabled={isTranslating}
            showAutoTranslate
            autoTranslate={autoTranslate}
            onAutoTranslateChange={setAutoTranslate}
            helperText="Select multiple languages for qualification name and description translations."
          />

          {formData.names.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>
                Qualification Names and Descriptions by Language *
              </label>
              <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                {formData.names.map((name) => {
                  const language = languages.find((l) => l.id === name.languageId);
                  return (
                    <div key={name.languageId} style={{ marginBottom: 12, padding: 8, background: '#f9fafb', borderRadius: 6 }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 4 }}>
                        {language?.name} ({(language as any)?.nativeName})
                      </div>
                      <div style={{ marginBottom: 4 }}>
                        <label style={{ fontSize: '12px', fontWeight: '500' }}>Name:</label>
                        <input
                          type="text" required value={name.name}
                          onChange={(e) => {
                            const updatedNames = [...formData.names];
                            const index = updatedNames.findIndex((n) => n.languageId === name.languageId);
                            updatedNames[index] = { ...name, name: e.target.value };
                            setFormData({ ...formData, names: updatedNames });
                          }}
                          style={{
                            width: '100%', padding: '4px 6px', border: '1px solid #e5e7eb',
                            borderRadius: 4, fontSize: '12px', marginTop: 2, boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '500' }}>Description:</label>
                        <textarea
                          required value={name.description}
                          onChange={(e) => {
                            const updatedNames = [...formData.names];
                            const index = updatedNames.findIndex((n) => n.languageId === name.languageId);
                            updatedNames[index] = { ...name, description: e.target.value };
                            setFormData({ ...formData, names: updatedNames });
                          }}
                          rows={2}
                          style={{
                            width: '100%', padding: '4px 6px', border: '1px solid #e5e7eb',
                            borderRadius: 4, fontSize: '12px', marginTop: 2, resize: 'vertical', boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <FormActions
            onCancel={() => setShowModal(false)}
            submitLabel={isTranslating ? 'Translating...' : editingQualification ? 'Update' : 'Create'}
            disabled={isTranslating}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default Qualifications;

