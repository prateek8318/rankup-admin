import { useState, useEffect } from 'react';
import { subjectApi, SubjectDto, CreateSubjectDto, UpdateSubjectDto, SubjectNameDto, languageApi, LanguageDto } from '@/services/masterApi';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import Loader from '@/components/Loader';

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

  if (loading) return <Loader text="Loading subjects..." />;

  return (
    <>
      <div>
        {/* Header – same style as Exams */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "20px",
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 20px",
                border: "1px solid #e5e7eb",
                borderRadius: "20px",
                background: "#fff",
                fontSize: "16px",
                width: "300px",
                outline: "none"
              }}
            />

            <select
              value={selectedLanguageIdFilter ?? ''}
              onChange={e => setSelectedLanguageIdFilter(e.target.value ? Number(e.target.value) : null)}
              style={{
                padding: "10px 15px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "14px",
                minWidth: "150px"
              }}
            >
              <option value="">All languages</option>
              {languages.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setFormData({ name: '', description: '', names: [], isActive: true });
              setEditingSubject(null);
              setShowModal(true);
            }}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Add Subject
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e40af', color: '#fff' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Description</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Languages</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map(subject => (
                <tr key={subject.id} style={{
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: subject.isActive ? 'transparent' : '#f3f4f6',
                  opacity: subject.isActive ? 1 : 0.6
                }}>
                  <td style={{ padding: 12 }}>{subject.id}</td>
                  <td style={{ padding: 12 }}>{subject.name}</td>
                  <td style={{ padding: 12 }}>
                    {subject.description?.substring(0, 60)}{subject.description?.length > 60 ? '...' : ''}
                  </td>
                  <td style={{ padding: 12 }}>
                    {(subject.names || []).map(n => n.language?.name || `Lang ${n.languageId}`).join(', ') || '-'}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      background: subject.isActive ? '#dcfce7' : '#fee2e2',
                      color: subject.isActive ? '#166534' : '#991b1b'
                    }}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => handleEdit(subject)}
                      style={{ background: 'none', border: 'none', marginRight: 8 }}
                    >
                      <img src={editIcon} alt="Edit" style={{ width: 16 }} />
                    </button>
                    {subject.isActive && (
                      <button
                        onClick={() => handleDelete(subject.id)}
                        style={{ background: 'none', border: 'none' }}
                      >
                        <img src={deleteIcon} alt="Disable" style={{ width: 16 }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubjects.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No subjects found.
            </div>
          )}
        </div>

        {/* Modal – keep your existing modal logic */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 13, padding: 30, width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 600 }}>
                {editingSubject ? 'Edit Subject' : 'Add Subject'}
              </h3>

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

                {/* Translations list – your existing logic */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <strong>Translations</strong>
                    {/* You can keep add manual translation button if needed */}
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTranslating}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      background: 'linear-gradient(90deg, #2B5DBC 0%, #073081 100%)',
                      color: 'white',
                      border: 'none',
                      opacity: isTranslating ? 0.7 : 1
                    }}
                  >
                    {editingSubject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Subjects;