import React, { useEffect, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';
import {
  ExamDto,
  CreateExamDto,
  UpdateExamDto,
  getExamsList,
  createExam,
  updateExam,
  updateExamStatus,
  uploadExamImage
} from '@/services/examsApi';
import { qualificationApi, streamApi, languageApi, countryApi } from '@/services/masterApi';
import { QualificationDto, StreamDto, LanguageDto } from '@/types/qualification';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch (err) {
    ;
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
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
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
    minAge: 18,
    maxAge: 60,
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
      if (resp?.success && resp.data) setExams(resp.data);

      const qualsResp = await qualificationApi.getAll();
      setQualifications(Array.isArray(qualsResp.data) ? qualsResp.data : (qualsResp.data?.data || []));
      const streamsResp = await streamApi.getAll();
      setStreams(Array.isArray(streamsResp.data) ? streamsResp.data : (streamsResp.data?.data || []));
    } catch (err) {
      ;
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
      ;
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

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
      ;
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
    setCroppedImage(null);
    setIsInternationalFlag(exam.countryCode !== 'IN');
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this exam?')) return;
    try {
      await updateExamStatus(id, false);
      await fetchData();
    } catch (err) {
      ;
      alert('Failed to deactivate exam');
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.name.trim()) newErrors.name = 'Exam name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!isInternationalFlag && !formData.countryCode) newErrors.countryCode = 'Country is required';
    if (!formData.qualificationIds || formData.qualificationIds.length === 0) newErrors.qualificationIds = 'At least one qualification is required';
    if (formData.minAge < 18) newErrors.minAge = 'Minimum age must be at least 18';
    if (formData.maxAge > 60) newErrors.maxAge = 'Maximum age cannot exceed 60';
    if (formData.minAge >= 18 && formData.maxAge >= 18 && formData.minAge > formData.maxAge) newErrors.ageRange = 'Minimum age cannot be greater than maximum age';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isInternationalFlag]);

  const validateImage = useCallback((file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Only PNG, JPG, and JPEG formats are allowed' }));
      return false;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return false;
    }
    setErrors(prev => { const { image, ...rest } = prev; return rest; });
    return true;
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImage(file)) {
      setImageFile(file);
      setShowCropModal(true);
    }
  }, [validateImage]);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (imageFile && croppedAreaPixels) {
      try {
        const croppedImg = await getCroppedImg(imageFile, croppedAreaPixels);
        setCroppedImage(croppedImg);
        const blob = await fetch(croppedImg).then(r => r.blob());
        const croppedFile = new File([blob], imageFile.name, { type: imageFile.type });
        setImageFile(croppedFile);
        setShowCropModal(false);
      } catch (error) {
        ;
        alert('Failed to crop image');
      }
    }
  }, [imageFile, croppedAreaPixels]);

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false);
    setImageFile(null);
    setCroppedImage(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingExam) {
        const payload: UpdateExamDto = { id: editingExam.id, ...formData } as any;
        if (isInternationalFlag) (payload as any).isInternational = true;
        await updateExam(editingExam.id, payload);
        if (imageFile) {
          const up = await uploadExamImage(editingExam.id, imageFile);
          if (up && (up as any).imageUrl) setFormData(prev => ({ ...prev, imageUrl: (up as any).imageUrl } as any));
        }
      } else {
        const createPayload: any = { ...formData };
        if (isInternationalFlag) createPayload.isInternational = true;
        const resp = await createExam(createPayload);
        const createdId = resp?.data?.id || (resp?.data as any)?.examId || (resp?.data && (resp.data as any).id);
        if (imageFile && createdId) {
          const up = await uploadExamImage(createdId, imageFile);
          if (up && (up as any).imageUrl) setFormData(prev => ({ ...prev, imageUrl: (up as any).imageUrl } as any));
        }
      }
      setShowModal(false);
      setEditingExam(null);
      setFormData({ name: '', description: '', countryCode: '', minAge: 18, maxAge: 60, names: [], qualificationIds: [], streamIds: [] });
      setImageFile(null);
      setIsInternationalFlag(false);
      await fetchData();
    } catch (err) {
      ;
      alert('Failed to save exam');
    }
  };

  const handleLanguageToggle = async (languageId: number) => {
    const names = formData.names || [];
    const isSelected = selectedLanguages.includes(languageId);
    if (isSelected) {
      setSelectedLanguages(prev => prev.filter(id => id !== languageId));
      setFormData({ ...formData, names: names.filter(n => n.languageId !== languageId) });
    } else {
      setSelectedLanguages(prev => [...prev, languageId]);
      setIsTranslating(true);
      try {
        const lang = languages.find(l => l.id === languageId);
        const translatedName = lang && (lang as any).code !== 'en' ? await translateText(formData.name || '', (lang as any).code) : formData.name || '';
        const translatedDesc = lang && (lang as any).code !== 'en' ? await translateText(formData.description || '', (lang as any).code) : formData.description || '';
        setFormData({ ...formData, names: [...names, { languageId, name: translatedName, description: translatedDesc }] });
      } catch (err) {
        ;
      } finally {
        setIsTranslating(false);
      }
    }
  };

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
  }, [formData.name]);

  const filteredExams = exams.filter(ex => {
    const matchesSearch = (ex.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (ex.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || (regionFilter === 'india' && ex.countryCode === 'IN') || (regionFilter === 'international' && ex.countryCode !== 'IN');
    return matchesSearch && matchesRegion;
  });

  return (
    <>
      <div>
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
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              value={filterLanguageId ?? ''}
              onChange={e => setFilterLanguageId(e.target.value ? parseInt(e.target.value) : null)}
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
              {languages.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
            </select>
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value as any)}
              style={{
                padding: "10px 15px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "14px",
                minWidth: "150px"
              }}
            >
              <option value="all">All regions</option>
              <option value="india">India</option>
              <option value="international">International</option>
            </select>
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', description: '', countryCode: 'IN', minAge: 18, maxAge: 60, names: [], qualificationIds: [], streamIds: [] });
              setSelectedLanguages([]);
              setImageFile(null);
              setCroppedImage(null);
              setIsInternationalFlag(false);
              setErrors({});
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
            Add Exam
          </button>
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
                  <tr key={exam.id} style={{
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: exam.isActive ? 'transparent' : '#f3f4f6',
                    opacity: exam.isActive ? 1 : 0.6
                  }}>
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
                    <td style={{ padding: 12 }}>
                      <span style={{ padding: '4px 8px', borderRadius: 12, background: exam.isActive ? '#dcfce7' : '#fee2e2', color: exam.isActive ? '#166534' : '#991b1b' }}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => handleEdit(exam)} style={{ background: 'none', border: 'none', marginRight: 8 }} title="Edit">
                        <img src={editIcon} alt="Edit" style={{ width: 16 }} />
                      </button>
                      {exam.isActive && (
                        <button onClick={() => handleDelete(exam.id)} style={{ background: 'none', border: 'none', marginRight: 8 }} title="Delete">
                          <img src={deleteIcon} alt="Delete" style={{ width: 16 }} />
                        </button>
                      )}
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

              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                {errors.image && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: 8 }}>{errors.image}</div>}
                <div style={{
                  width: 100,
                  height: 100,
                  border: errors.image ? '2px dashed #dc2626' : '2px dashed #d1d5db',
                  borderRadius: '50%',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#f9fafb',
                  position: 'relative'
                }} onClick={() => document.getElementById('examImageInput')?.click()}>
                  {croppedImage ? (
                    <img src={croppedImage} alt="Cropped" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : imageFile ? (
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
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Click to upload exam image (PNG, JPG, JPEG only)</div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Name *</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 8,
                      border: errors.name ? '1px solid #dc2626' : '1px solid #e5e7eb',
                      fontSize: '14px'
                    }}
                  />
                  {errors.name && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.name}</div>}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 8,
                      border: errors.description ? '1px solid #dc2626' : '1px solid #e5e7eb',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                  {errors.description && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.description}</div>}
                </div>

                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Country *</label>
                    <select
                      value={formData.countryCode}
                      onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: errors.countryCode ? '1px solid #dc2626' : '1px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                      disabled={isInternationalFlag}
                    >
                      <option value="">Select country</option>
                      {countries.filter(c => !(isInternationalFlag && c.code === 'IN')).map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                    {errors.countryCode && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.countryCode}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Min Age</label>
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={formData.minAge || 18}
                      onChange={e => {
                        const value = parseInt(e.target.value || '18');
                        if (value >= 18 && value <= 60) setFormData({ ...formData, minAge: value });
                      }}
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: errors.minAge ? '1px solid #dc2626' : '1px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                    {errors.minAge && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.minAge}</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Max Age</label>
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={formData.maxAge || 60}
                      onChange={e => {
                        const value = parseInt(e.target.value || '60');
                        if (value >= 18 && value <= 60) setFormData({ ...formData, maxAge: value });
                      }}
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: errors.maxAge ? '1px solid #dc2626' : '1px solid #e5e7eb',
                        fontSize: '14px'
                      }}
                    />
                    {errors.maxAge && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.maxAge}</div>}
                  </div>
                  {errors.ageRange && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4, flex: '1 1 100%' }}>{errors.ageRange}</div>}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Select Qualifications *</label>
                  <div style={{ border: errors.qualificationIds ? '1px solid #dc2626' : '1px solid #e5e7eb', borderRadius: 8, padding: 10, maxHeight: 300, overflowY: 'auto' }}>
                    {qualifications.map(q => (
                      <label key={q.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.qualificationIds.includes(q.id)}
                          onChange={() => {
                            const arr = formData.qualificationIds.includes(q.id) ? formData.qualificationIds.filter(id => id !== q.id) : [...formData.qualificationIds, q.id];
                            setFormData({ ...formData, qualificationIds: arr });
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '14px' }}>{q.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.qualificationIds && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.qualificationIds}</div>}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '14px', fontWeight: '500' }}>Select Streams</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, maxHeight: 200, overflowY: 'auto' }}>
                    {streams.map(s => (
                      <label key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.streamIds.includes(s.id)}
                          onChange={() => {
                            const arr = formData.streamIds.includes(s.id) ? formData.streamIds.filter(id => id !== s.id) : [...formData.streamIds, s.id];
                            setFormData({ ...formData, streamIds: arr });
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
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
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(lang.id)}
                            onChange={() => handleLanguageToggle(lang.id)}
                            disabled={isTranslating}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ fontSize: '14px' }}>{lang.name} ({lang.code})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {(formData.names || []).length > 0 && (
                  <div style={{ marginBottom: 16, padding: 12, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>Translated Content:</h4>
                    {(formData.names || []).map((name, idx) => {
                      const lang = languages.find(l => l.id === name.languageId);
                      return (
                        <div key={idx} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #bfdbfe' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', color: '#1e40af' }}>
                            {lang?.name} ({lang?.code})
                          </p>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#374151' }}>
                            <strong>Name:</strong> {name.name}
                          </p>
                          <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
                            <strong>Description:</strong> {name.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isInternationalFlag}
                      disabled={formData.countryCode === 'IN'}
                      onChange={e => setIsInternationalFlag(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px' }}>International Exam</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditingExam(null); setErrors({}); }}
                    style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '14px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTranslating}
                    style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(90deg, #2B5DBC 0%, #073081 100%)', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500', opacity: isTranslating ? 0.6 : 1 }}
                  >
                    {isTranslating ? 'Translating...' : (editingExam ? 'Update Exam' : 'Create Exam')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showCropModal && imageFile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 13, padding: 20, width: 600, height: 500 }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Crop Image</h3>
            <div style={{ position: 'relative', width: '100%', height: 350, marginBottom: 20 }}>
              <Cropper
                image={URL.createObjectURL(imageFile)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: '500' }}>Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCropCancel}
                style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(90deg, #2B5DBC 0%, #073081 100%)', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Exams;
