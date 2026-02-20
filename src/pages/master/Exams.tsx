import React, { useEffect, useState } from 'react';
import {
  ExamDto,
  CreateExamDto,
  UpdateExamDto,
  getExamsList,
  createExam,
  updateExam,
  deleteExam,
  updateExamStatus,
  uploadExamImage
} from '@/services/examsApi';
import { qualificationApi } from '@/services/qualificationApi';
import { languageApi, countryApi } from '@/services/masterApi';
import { QualificationDto, StreamDto, LanguageDto } from '@/types/qualification';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

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

const Exams = () => {
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [filterLanguageId, setFilterLanguageId] = useState<number | null>(null);
  const [regionFilter, setRegionFilter] = useState<'all' | 'india' | 'international'>('all');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isInternationalFlag, setIsInternationalFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState<CreateExamDto>({
    name: '',
    description: '',
    countryCode: 'IN',
    minAge: 0,
    maxAge: 0,
    names: [],
    qualificationIds: [],
    streamIds: []
  });

  useEffect(() => {
    fetchData();
    fetchLanguages();
    fetchCountries();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await getExamsList({ page: 1, limit: 1000 });
      console.log('fetched exams response', resp);
      if (resp?.success && resp.data) setExams(resp.data);

      const quals = await qualificationApi.getAllQualifications();
      setQualifications(Array.isArray(quals) ? quals : (quals as any)?.data || []);
      const strs = await qualificationApi.getAllStreams();
      setStreams(Array.isArray(strs) ? strs : (strs as any)?.data || []);
    } catch (err) {
      console.error('fetchData error', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      if (response.data) {
        if (response.data.success && response.data.data) setLanguages(response.data.data);
        else if (Array.isArray(response.data)) setLanguages(response.data);
        else if (response.data.data && Array.isArray(response.data.data)) setLanguages(response.data.data);
        else setLanguages([]);
      } else if (response && Array.isArray(response)) {
        setLanguages(response);
      } else {
        setLanguages([]);
      }
    } catch (err) {
      console.error('fetchLanguages error', err);
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  // Keep international flag in sync with country selection: if India selected, disable international
  useEffect(() => {
    if (formData.countryCode === 'IN' && isInternationalFlag) {
      setIsInternationalFlag(false);
    }
  }, [formData.countryCode]);

  const fetchCountries = async () => {
    try {
      const res = await countryApi.getAll();
      if (res?.data?.data) setCountries(res.data.data);
      else if (Array.isArray(res.data)) setCountries(res.data);
      else setCountries([]);
    } catch (err) {
      console.error('fetchCountries error', err);
      setCountries([]);
    }
  };

  const handleEdit = (exam: ExamDto) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      description: exam.description,
      countryCode: exam.countryCode,
      minAge: exam.minAge,
      maxAge: exam.maxAge,
      names: exam.names || [],
      qualificationIds: exam.qualificationIds || [],
      streamIds: exam.streamIds || []
    });
    setSelectedLanguages((exam.names || []).map(n => n.languageId));
    setImageFile(null);
    setIsInternationalFlag(exam.countryCode !== 'IN');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await deleteExam(id);
      await fetchData();
    } catch (err) {
      console.error('deleteExam error', err);
      alert('Failed to delete exam');
    }
  };

  const handleToggleStatus = async (exam: ExamDto) => {
    try {
      await updateExamStatus(exam.id, !exam.isActive);
      await fetchData();
    } catch (err) {
      console.error('updateExamStatus error', err);
      alert('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || ((!(isInternationalFlag)) && !formData.countryCode) || (formData.qualificationIds?.length || 0) === 0) {
      alert('Please fill required fields');
      return;
    }

    try {
      if (editingExam) {
        const payload: UpdateExamDto = { id: editingExam.id, ...formData } as any;
        // include international flag if present
        if (isInternationalFlag) (payload as any).isInternational = true;
        await updateExam(editingExam.id, payload);
        if (imageFile) {
          try {
            const up = await uploadExamImage(editingExam.id, imageFile);
            console.log('upload response', up);
            if (up && (up as any).imageUrl) setFormData(prev => ({ ...prev, imageUrl: (up as any).imageUrl } as any));
          } catch (err) { console.error('upload image error', err); }
        }
      } else {
        const createPayload: any = { ...formData };
        if (isInternationalFlag) createPayload.isInternational = true;
        const resp = await createExam(createPayload);
        const createdId = resp?.data?.id || (resp?.data as any)?.examId || (resp?.data && (resp.data as any).id);
        if (imageFile && createdId) {
          try {
            const up = await uploadExamImage(createdId, imageFile);
            console.log('upload response', up);
            if (up && (up as any).imageUrl) setFormData(prev => ({ ...prev, imageUrl: (up as any).imageUrl } as any));
          } catch (err) { console.error('upload image error', err); }
        }
      }
      setShowModal(false);
      setEditingExam(null);
      setFormData({ name: '', description: '', countryCode: '', minAge: 0, maxAge: 0, names: [], qualificationIds: [], streamIds: [] });
      setImageFile(null);
      setIsInternationalFlag(false);
      await fetchData();
    } catch (err) {
      console.error('submit error', err);
      alert('Failed to save exam');
    }
  };

  const handleLanguageToggle = (languageId: number) => {
    const names = formData.names || [];
    const isSelected = selectedLanguages.includes(languageId);
    if (isSelected) {
      setSelectedLanguages(prev => prev.filter(id => id !== languageId));
      setFormData({ ...formData, names: names.filter(n => n.languageId !== languageId) });
    } else {
      setSelectedLanguages(prev => [...prev, languageId]);
      const add = async () => {
        setIsTranslating(true);
        try {
          const lang = languages.find(l => l.id === languageId);
          const translatedName = lang && (lang as any).code !== 'en' ? await translateText(formData.name || '', (lang as any).code) : formData.name || '';
          const translatedDesc = lang && (lang as any).code !== 'en' ? await translateText(formData.description || '', (lang as any).code) : formData.description || '';
          setFormData({ ...formData, names: [...names, { languageId, name: translatedName, description: translatedDesc }] });
        } finally { setIsTranslating(false); }
      };
      if (formData.name) add();
      else setFormData({ ...formData, names: [...names, { languageId, name: formData.name || '', description: formData.description || '' }] });
    }
  };

  // Auto-translate existing selected language names when main name changes
  useEffect(() => {
    if (!formData.name || !formData.names || formData.names.length === 0) return;
    const translateAll = async () => {
      setIsTranslating(true);
      try {
        const updated = await Promise.all(formData.names.map(async n => {
          const lang = languages.find(l => l.id === n.languageId);
          if (lang && (lang as any).code && (lang as any).code !== 'en') {
            const translated = await translateText(formData.name, (lang as any).code);
            return { ...n, name: translated, description: await translateText(formData.description || '', (lang as any).code) };
          }
          return n;
        }));
        setFormData(prev => ({ ...prev, names: updated } as any));
      } finally { setIsTranslating(false); }
    };

    translateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name]);

  const filteredExams = exams.filter(ex => {
    const matchesSearch = (ex.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (ex.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = !filterLanguageId || (ex.names || []).some(n => n.languageId === filterLanguageId);
    const matchesRegion = regionFilter === 'all' || (regionFilter === 'india' && ex.countryCode === 'IN') || (regionFilter === 'international' && ex.countryCode !== 'IN');
    return matchesSearch && matchesLang && matchesRegion;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#E6F5FF', padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Exams (Master)</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <select value={filterLanguageId ?? ''} onChange={e => setFilterLanguageId(e.target.value ? parseInt(e.target.value) : null)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <option value="">All languages</option>
              {languages.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
            </select>
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value as any)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <option value="all">All regions</option>
              <option value="india">India</option>
              <option value="international">International</option>
            </select>
            <button onClick={() => { setFormData({ name: '', description: '', countryCode: 'IN', minAge: 0, maxAge: 0, names: [], qualificationIds: [], streamIds: [] }); setSelectedLanguages([]); setImageFile(null); setIsInternationalFlag(false); setShowModal(true); }} style={{ padding: '10px 16px', borderRadius: 8, background: '#2563eb', color: '#fff' }}>Add Exam</button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
          {loading ? <div>Loading exams...</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1e40af', color: '#fff' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Country</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Age</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Languages</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Image</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map(exam => (
                  <tr key={exam.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 12 }}>{exam.id}</td>
                    <td style={{ padding: 12 }}>{exam.name}</td>
                    <td style={{ padding: 12 }}>{exam.countryCode}</td>
                    <td style={{ padding: 12 }}>{exam.minAge}-{exam.maxAge}</td>
                    <td style={{ padding: 12 }}>{(exam.names || []).map(n => languages.find(l => l.id === n.languageId)?.name || n.languageId).join(', ')}</td>
                    <td style={{ padding: 12 }}>
                      {(() => {
                        const src = (exam as any).imageUrl || (exam as any).image || (exam as any).logo || (exam as any).imagePath || '';
                        if (!src) return null;
                        const normalized = (typeof window !== 'undefined' && src.startsWith('/')) ? `${window.location.origin}${src}` : src;
                        return <img src={normalized} alt="exam" style={{ height: 32, marginRight: 8 }} />;
                      })()}
                    </td>
                    <td style={{ padding: 12 }}><span style={{ padding: '4px 8px', borderRadius: 12, background: exam.isActive ? '#dcfce7' : '#fee2e2', color: exam.isActive ? '#166534' : '#991b1b' }}>{exam.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => handleEdit(exam)} style={{ background: 'none', border: 'none', marginRight: 8 }} title="Edit"><img src={editIcon} alt="Edit" style={{ width: 16 }} /></button>
                      <button onClick={() => handleDelete(exam.id)} style={{ background: 'none', border: 'none', marginRight: 8 }} title="Delete"><img src={deleteIcon} alt="Delete" style={{ width: 16 }} /></button>
                      <button onClick={() => handleToggleStatus(exam)} style={{ background: 'none', border: 'none' }}>{exam.isActive ? 'Disable' : 'Enable'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 13, padding: 30, width: 720, maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
                {editingExam ? 'Edit Exam' : 'Add Exam'}
              </h3>

              {/* Image Upload Section */}
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <div style={{ 
                  width: 100, 
                  height: 100, 
                  border: '2px dashed #d1d5db', 
                  borderRadius: '50%', 
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#f9fafb',
                  position: 'relative'
                }} onClick={() => document.getElementById('examImageInput')?.click()}>
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : editingExam?.imageUrl ? (
                    <img src={editingExam.imageUrl} alt="Current" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                      <div style={{ fontSize: '12px' }}>Upload Image</div>
                    </div>
                  )}
                </div>
                <input
                  id="examImageInput"
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Click to upload exam image</div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '14px' }} />
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Description *</label>
                  <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '14px', resize: 'vertical' }} />
                </div>
                
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Country *</label>
                    <select required={!isInternationalFlag} disabled={isInternationalFlag} value={formData.countryCode} onChange={e => setFormData({ ...formData, countryCode: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '14px' }}>
                      <option value="">Select country</option>
                      {countries.filter(c => !(isInternationalFlag && c.code === 'IN')).map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Min Age</label>
                    <input type="number" value={formData.minAge} onChange={e => setFormData({ ...formData, minAge: parseInt(e.target.value || '0') })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '14px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Max Age</label>
                    <input type="number" value={formData.maxAge} onChange={e => setFormData({ ...formData, maxAge: parseInt(e.target.value || '0') })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '14px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Select Qualifications *</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, maxHeight: 120, overflowY: 'auto' }}>
                    {qualifications.map(q => (
                      <label key={q.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.qualificationIds.includes(q.id)} onChange={() => {
                          const arr = formData.qualificationIds.includes(q.id) ? formData.qualificationIds.filter(id => id !== q.id) : [...formData.qualificationIds, q.id];
                          setFormData({ ...formData, qualificationIds: arr });
                        }} style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '14px' }}>{q.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Select Streams</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, maxHeight: 120, overflowY: 'auto' }}>
                    {streams.map(s => (
                      <label key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.streamIds.includes(s.id)} onChange={() => {
                          const arr = formData.streamIds.includes(s.id) ? formData.streamIds.filter(id => id !== s.id) : [...formData.streamIds, s.id];
                          setFormData({ ...formData, streamIds: arr });
                        }} style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '14px' }}>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Select Languages *</label>
                  {languagesLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#6b7280' }}>Loading languages...</div>
                  ) : (
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, maxHeight: 120, overflowY: 'auto' }}>
                      {languages.map(lang => (
                        <label key={lang.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', cursor: 'pointer' }}>
                          <input type="checkbox" checked={selectedLanguages.includes(lang.id)} onChange={() => handleLanguageToggle(lang.id)} style={{ width: '16px', height: '16px' }} />
                          <span style={{ fontSize: '14px' }}>{lang.name} ({lang.code})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={isInternationalFlag} disabled={formData.countryCode === 'IN'} onChange={e => { setIsInternationalFlag(e.target.checked); if (e.target.checked) setFormData({ ...formData, countryCode: '' }); else if (!formData.countryCode) setFormData({ ...formData, countryCode: 'IN' }); }} style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '14px' }}>International Exam</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button type="button" onClick={() => { setShowModal(false); setEditingExam(null); }} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={isTranslating} style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(90deg, #2B5DBC 0%, #073081 100%)', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500', opacity: isTranslating ? 0.6 : 1 }}>{isTranslating ? 'Translating...' : (editingExam ? 'Update Exam' : 'Create Exam')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
