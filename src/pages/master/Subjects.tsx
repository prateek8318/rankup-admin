import { useState, useEffect } from 'react';
import { subjectApi, SubjectDto, CreateSubjectDto, UpdateSubjectDto, SubjectNameDto, languageApi, LanguageDto } from '@/services/masterApi';
import Loader from '@/components/Loader';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch (err) {
    console.error('translateText error', err);
    return text;
  }
};

const Subjects = () => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguageIdFilter, setSelectedLanguageIdFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [formData, setFormData] = useState<CreateSubjectDto>({
    name: '',
    description: '',
    names: [],
    isActive: true
  });
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
    fetchLanguages();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await subjectApi.getAll();
      let data = res.data?.data || res.data || [];
      if (!Array.isArray(data)) data = [];
      setSubjects(data.map((s: any) => ({ ...s, names: s.subjectLanguages || s.names || [] })));
    } catch (err) {
      console.error(err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    setLanguagesLoading(true);
    try {
      const res = await languageApi.getAll();
      let data = res.data?.data || res.data || [];
      if (!Array.isArray(data)) data = [];
      setLanguages(data);
    } catch (err) {
      console.error(err);
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        subjectLanguages: formData.names || []
      };

      if (editingSubject) {
        await subjectApi.update(editingSubject.id, payload);
      } else {
        await subjectApi.create(payload);
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (subject: SubjectDto) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || '',
      names: subject.names || [],
      isActive: subject.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Disable this subject?')) return;
    try {
      await subjectApi.updateStatus(id, false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSubjects = subjects.filter(s =>
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'description', 
      label: 'Description',
      render: (subject) => {
        const desc = subject.description;
        return desc ? (desc.length > 60 ? `${desc.substring(0, 60)}...` : desc) : '-';
      }
    },
    {
      key: 'languages',
      label: 'Languages',
      render: (subject) => {
        const names = subject.names || [];
        return names.map((n: any) => n.language?.name || `Lang ${n.languageId}`).join(', ') || '-';
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (subject) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: 12,
          background: subject.isActive ? '#dcfce7' : '#fee2e2',
          color: subject.isActive ? '#166534' : '#991b1b'
        }}>
          {subject.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'actions', label: 'Actions' }
  ];

  if (loading) return <Loader text="Loading subjects..." />;

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search subjects..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Subject"
        onAddClick={() => {
          setFormData({ name: '', description: '', names: [], isActive: true });
          setEditingSubject(null);
          setShowModal(true);
        }}
        filters={[
          {
            key: 'language',
            label: 'language',
            value: selectedLanguageIdFilter,
            options: languages.map(l => ({ value: l.id, label: `${l.name} (${l.code})` })),
            onChange: (value) => setSelectedLanguageIdFilter(value as number | null)
          }
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredSubjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No subjects found."
        loadingMessage="Loading subjects..."
      />

        {/* Modal */}
        <MasterModal
          isOpen={showModal}
          title={editingSubject ? 'Edit Subject' : 'Add Subject'}
          width={600}
        >
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Name *</label>
              <input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', resize: 'vertical' }}
              />
            </div>

            {/* Auto translate toggle */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={e => setAutoTranslate(e.target.checked)}
                />
                Auto-translate when name changes
              </label>
              {isTranslating && <small>Translating...</small>}
            </div>

            {/* Translations list */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <strong>Translations</strong>
              </div>
              {formData.names?.map((t, i) => (
                <div key={i} style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <select
                    value={t.languageId}
                    onChange={e => {
                      const updated = [...(formData.names || [])];
                      updated[i] = { ...t, languageId: Number(e.target.value) };
                      setFormData({ ...formData, names: updated });
                    }}
                    style={{ marginBottom: 8, padding: 6, borderRadius: 6 }}
                  >
                    {languages.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                  <input
                    value={t.name}
                    onChange={e => {
                      const updated = [...(formData.names || [])];
                      updated[i] = { ...t, name: e.target.value };
                      setFormData({ ...formData, names: updated });
                    }}
                    placeholder="Translated name"
                    style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8, borderRadius: 6 }}
                  />
                  <textarea
                    value={t.description || ''}
                    onChange={e => {
                      const updated = [...(formData.names || [])];
                      updated[i] = { ...t, description: e.target.value };
                      setFormData({ ...formData, names: updated });
                    }}
                    placeholder="Translated description"
                    rows={2}
                    style={{ width: '100%', padding: 8, borderRadius: 6 }}
                  />
                </div>
              ))}
            </div>

            <FormActions
              onCancel={() => setShowModal(false)}
              submitLabel={editingSubject ? 'Update' : 'Create'}
              disabled={isTranslating}
            />
          </form>
        </MasterModal>
    </>
  );
};

export default Subjects;