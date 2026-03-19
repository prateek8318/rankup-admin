import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Streams.module.css';
import { useStreams } from '@/hooks/useStreams';
import { qualificationApi } from '@/services/qualificationApi';
import { languageApi, streamApi } from '@/services/masterApi';
import {
  StreamDto, CreateStreamDto, StreamName, QualificationDto, LanguageDto,
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

const Streams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStream, setEditingStream] = useState<StreamDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string | undefined>(undefined);

  const [formData, setFormData] = useState<CreateStreamDto>({
    name: '', description: '', qualificationId: 0, names: [],
  });

  const {
    streams,
    qualifications,
    languages,
    loading,
    languagesLoading,
    deleteStream,
    saveStream,
  } = useStreams(selectedLanguageFilter);

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

  /* ─── auto-translate on name/description change ─ */
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
    if (!formData.name || !formData.description || !formData.qualificationId) {
      toast.error('Please fill all required fields');
      return;
    }
    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language');
      return;
    }
    const success = await saveStream(formData, editingStream);
    if (success) {
      resetForm();
      setShowModal(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', qualificationId: 0, names: [] });
    setSelectedLanguages([]);
    setEditingStream(null);
  };

  const handleEdit = (stream: StreamDto) => {
    setEditingStream(stream);
    setFormData({
      name: stream.name, description: stream.description,
      qualificationId: stream.qualificationId, names: stream.names,
    });
    setSelectedLanguages(stream.names.map((n) => n.languageId));
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await deleteStream(id);
  };

  /* ─── table config ─ */
  const filteredStreams = streams.filter(
    (s) => {
      // Safe search term handling
      if (!searchTerm || typeof searchTerm !== 'string') {
        return true; // Show all if no search term
      }
      
      const searchLower = searchTerm.toLowerCase();
      
      // Search in main fields with null checks
      const mainNameMatch = (s.name || '').toLowerCase().includes(searchLower);
      const mainDescMatch = (s.description || '').toLowerCase().includes(searchLower);
      const qualificationMatch = (s.qualificationName || '').toLowerCase().includes(searchLower);
      
      // Search in names array for multilingual content with null checks
      const namesMatch = s.names?.some((name: any) => 
        (name.name || '').toLowerCase().includes(searchLower) ||
        (name.description || '').toLowerCase().includes(searchLower)
      ) || false;
      
      const result = mainNameMatch || mainDescMatch || qualificationMatch || namesMatch;
      return result;
    }
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'description', label: 'Description',
      render: (stream) => {
        // Try to get description from the main description field first
        if (stream.description) {
          return stream.description;
        }
        
        // If main description is empty, try to get it from the names array
        const firstName = stream.names?.[0];
        if (firstName?.description) {
          return firstName.description;
        }
        
        // Fallback to empty string
        return '-';
      },
    },
    { key: 'qualificationName', label: 'Qualification' },
    {
      key: 'languages', label: 'Languages',
      render: (stream) => {
        return (
          <div className={styles.languageContainer}>
            {stream.names.map((name: StreamName) => {
              const language = languages.find((l) => l.id === name.languageId);
              
              return (
                <span
                  key={name.languageId}
                  className={styles.languageBadge}
                >
                  {language?.name || `Lang ${name.languageId}`}
                </span>
              );
            })}
          </div>
        );
      },
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge isActive={row.isActive} /> },
    { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { key: 'actions', label: 'Actions' },
  ];

  /* ─── render ─ */
  return (
    <>
      <MasterHeader
        searchPlaceholder="Search streams..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Stream"
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
        data={filteredStreams}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No streams found."
        loadingMessage="Loading streams..."
      />

      <MasterModal
        isOpen={showModal}
        title={editingStream ? 'Edit Stream' : 'Add Stream'}
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
                <span className={styles.translatingText}>(Translating...)</span>
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
            label="Select Qualification"
            value={formData.qualificationId}
            onChange={(val) => setFormData({ ...formData, qualificationId: parseInt(val) })}
            options={qualifications.map((q) => ({ value: q.id, label: q.name }))}
            required
            placeholder="Choose a qualification..."
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
            helperText="Select multiple languages for stream name and description translations."
          />

          {formData.names.length > 0 && (
            <div className={styles.translationSection}>
              <label className={styles.translationLabel}>
                Stream Names and Descriptions by Language *
              </label>
              <div className={styles.translationList}>
                {formData.names.map((name) => {
                  const language = languages.find((l) => l.id === name.languageId);
                  return (
                    <div key={name.languageId} className={styles.translationItem}>
                      <div className={styles.translationLangName}>
                        {language?.name} ({(language as any)?.nativeName})
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Name:</label>
                        <input
                          type="text" required value={name.name}
                          onChange={(e) => {
                            const updatedNames = [...formData.names];
                            const index = updatedNames.findIndex((n) => n.languageId === name.languageId);
                            updatedNames[index] = { ...name, name: e.target.value };
                            setFormData({ ...formData, names: updatedNames });
                          }}
                          className={styles.inputField}
                        />
                      </div>
                      <div>
                        <label className={styles.inputLabel}>Description:</label>
                        <textarea
                          required value={name.description}
                          onChange={(e) => {
                            const updatedNames = [...formData.names];
                            const index = updatedNames.findIndex((n) => n.languageId === name.languageId);
                            updatedNames[index] = { ...name, description: e.target.value };
                            setFormData({ ...formData, names: updatedNames });
                          }}
                          rows={2}
                          className={styles.textareaField}
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
            submitLabel={isTranslating ? 'Translating...' : editingStream ? 'Update' : 'Create'}
            disabled={isTranslating}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default Streams;

