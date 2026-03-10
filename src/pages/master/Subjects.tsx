import { useState, useEffect } from 'react';
import {
  subjectApi, SubjectDto, CreateSubjectDto,
  languageApi, LanguageDto,
} from '@/services/masterApi';
import Loader from '@/components/Loader';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import FormCheckbox from '@/components/common/FormCheckbox';
import StatusBadge from '@/components/common/StatusBadge';

const Subjects = () => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguageIdFilter, setSelectedLanguageIdFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [formData, setFormData] = useState<CreateSubjectDto>({
    name: '', description: '', names: [], isActive: true,
  });
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setLanguagesLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
    fetchLanguages();
  }, []);

  /* ─── data fetching ─ */
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await subjectApi.getAll();
      let data = res.data?.data || res.data || [];
      if (!Array.isArray(data)) data = [];
      setSubjects(data.map((s: any) => ({ ...s, names: s.subjectLanguages || s.names || [] })));
    } catch (err) {
      console.error(err);
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
    } finally {
      setLanguagesLoading(false);
    }
  };

  /* ─── handlers ─ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, subjectLanguages: formData.names || [] };
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
      isActive: subject.isActive ?? true,
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

  /* ─── table config ─ */
  const filteredSubjects = subjects.filter(
    (s) =>
      (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (s.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()),
  );

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'description', label: 'Description',
      render: (subject) => {
        const desc = subject.description;
        return desc ? (desc.length > 60 ? `${desc.substring(0, 60)}...` : desc) : '-';
      },
    },
    {
      key: 'languages', label: 'Languages',
      render: (subject) => {
        const names = subject.names || [];
        return names.map((n: any) => n.language?.name || `Lang ${n.languageId}`).join(', ') || '-';
      },
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge isActive={row.isActive} /> },
    { key: 'actions', label: 'Actions' },
  ];

  if (loading) return <Loader text="Loading subjects..." />;

  /* ─── render ─ */
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
            key: 'language', label: 'language',
            value: selectedLanguageIdFilter,
            options: languages.map((l) => ({ value: l.id, label: `${l.name} (${l.code})` })),
            onChange: (value) => setSelectedLanguageIdFilter(value as number | null),
          },
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

      <MasterModal
        isOpen={showModal}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        width={600}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            required
          />

          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
          />

          <FormCheckbox
            label="Auto-translate when name changes"
            checked={autoTranslate}
            onChange={setAutoTranslate}
          />
          {isTranslating && <small>Translating...</small>}

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong>Translations</strong>
            </div>
            {formData.names?.map((t, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                <select
                  value={t.languageId}
                  onChange={(e) => {
                    const updated = [...(formData.names || [])];
                    updated[i] = { ...t, languageId: Number(e.target.value) };
                    setFormData({ ...formData, names: updated });
                  }}
                  style={{ marginBottom: 8, padding: 6, borderRadius: 6 }}
                >
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <input
                  value={t.name}
                  onChange={(e) => {
                    const updated = [...(formData.names || [])];
                    updated[i] = { ...t, name: e.target.value };
                    setFormData({ ...formData, names: updated });
                  }}
                  placeholder="Translated name"
                  style={{
                    display: 'block', width: '100%', marginBottom: 8, padding: 8,
                    borderRadius: 6, boxSizing: 'border-box',
                  }}
                />
                <textarea
                  value={t.description || ''}
                  onChange={(e) => {
                    const updated = [...(formData.names || [])];
                    updated[i] = { ...t, description: e.target.value };
                    setFormData({ ...formData, names: updated });
                  }}
                  placeholder="Translated description"
                  rows={2}
                  style={{ width: '100%', padding: 8, borderRadius: 6, boxSizing: 'border-box' }}
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