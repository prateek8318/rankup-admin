import React, { useEffect, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import toast from 'react-hot-toast';
import { getCroppedImg } from '../../utils/cropImage';
import { ExamDto, CreateExamDto, UpdateExamDto } from '@/services/examsApi';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import { useExams } from '@/hooks/useExams';
import styles from './Exams.module.css';

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    return data?.[0]?.[0]?.[0] || text;
  } catch (err) {
    return text;
  }
};

const Exams = () => {
  const {
    exams, qualifications, streams, languages, countries, loading, languagesLoading, removeExam, saveExam
  } = useExams();

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
    if (formData.countryCode === 'IN' && isInternationalFlag) {
      setIsInternationalFlag(false);
    }
  }, [formData.countryCode, isInternationalFlag]);

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
    if (!window.confirm('Are you sure you want to deactivate this exam?')) return;
    await removeExam(id);
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
        toast.error('Failed to crop image');
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
    
    const success = await saveExam(formData, editingExam, imageFile, isInternationalFlag);
    if (success) {
      setShowModal(false);
      setEditingExam(null);
      setFormData({ name: '', description: '', countryCode: 'IN', minAge: 18, maxAge: 60, names: [], qualificationIds: [], streamIds: [] });
      setImageFile(null);
      setIsInternationalFlag(false);
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
  }, [formData.name, languages]);

  const filteredExams = exams.filter(ex => {
    const matchesSearch = (ex.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (ex.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || (regionFilter === 'india' && ex.countryCode === 'IN') || (regionFilter === 'international' && ex.countryCode !== 'IN');
    return matchesSearch && matchesRegion;
  });

  return (
    <>
      <div>
        <div className={styles.headerContainer}>
          <div className={styles.filtersRow}>
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filterLanguageId ?? ''}
              onChange={e => setFilterLanguageId(e.target.value ? parseInt(e.target.value) : null)}
              className={styles.filterSelect}
            >
              <option value="">All languages</option>
              {languages.map(l => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
            </select>
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value as any)}
              className={styles.filterSelect}
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
            className={styles.primaryButton}
          >
            Add Exam
          </button>
        </div>

        <div className={styles.tableContainer}>
          {loading ? <div>Loading exams...</div> : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Country</th>
                  <th className={styles.th}>Age</th>
                  <th className={styles.th}>Languages</th>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map(exam => (
                  <tr key={exam.id} className={exam.isActive ? styles.trActive : styles.trInactive}>
                    <td className={styles.td}>{exam.id}</td>
                    <td className={styles.td}>{exam.name}</td>
                    <td className={styles.td}>{exam.countryCode}</td>
                    <td className={styles.td}>{exam.minAge}-{exam.maxAge}</td>
                    <td className={styles.td}>{(exam.names || []).map(n => languages.find(l => l.id === n.languageId)?.name || n.languageId).join(', ')}</td>
                    <td className={styles.td}>
                      {(() => {
                        const src = (exam as any).imageUrl || (exam as any).image || (exam as any).logo || (exam as any).imagePath || '';
                        if (!src) return null;
                        const normalized = (typeof window !== 'undefined' && src.startsWith('/')) ? `${window.location.origin}${src}` : src;
                        return <img src={normalized} alt="exam" style={{ height: 32, marginRight: 8 }} />;
                      })()}
                    </td>
                    <td className={styles.td}>
                      <span className={exam.isActive ? styles.statusActive : styles.statusInactive}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <button onClick={() => handleEdit(exam)} className={styles.iconButton} title="Edit">
                        <img src={editIcon} alt="Edit" style={{ width: 16 }} />
                      </button>
                      {exam.isActive && (
                        <button onClick={() => handleDelete(exam.id)} className={styles.iconButton} title="Delete">
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
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>
                {editingExam ? 'Edit Exam' : 'Add Exam'}
              </h3>

              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                {errors.image && <div className={styles.errorText} style={{ marginBottom: 8 }}>{errors.image}</div>}
                <div 
                  className={errors.image ? styles.imageUploadBoxError : styles.imageUploadBox}
                  onClick={() => document.getElementById('examImageInput')?.click()}
                >
                  {croppedImage ? (
                    <img src={croppedImage} alt="Cropped" className={styles.imagePreview} />
                  ) : imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className={styles.imagePreview} />
                  ) : editingExam?.imageUrl ? (
                    <img src={editingExam.imageUrl} alt="Current" className={styles.imagePreview} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.imageIcon}>📷</div>
                      <div className={styles.helperText}>Upload Image</div>
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
                <div className={styles.helperText}>Click to upload exam image (PNG, JPG, JPEG only)</div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Name *</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? styles.formInputError : styles.formInput}
                  />
                  {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={errors.description ? styles.formInputError : styles.formInput}
                    style={{ resize: 'vertical' }}
                  />
                  {errors.description && <div className={styles.errorText}>{errors.description}</div>}
                </div>

                <div className={styles.row}>
                  <div className={styles.col}>
                    <label className={styles.formLabel}>Country *</label>
                    <select
                      value={formData.countryCode}
                      onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                      className={errors.countryCode ? styles.formInputError : styles.formInput}
                      disabled={isInternationalFlag}
                    >
                      <option value="">Select country</option>
                      {countries.filter(c => !(isInternationalFlag && c.code === 'IN')).map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                    {errors.countryCode && <div className={styles.errorText}>{errors.countryCode}</div>}
                  </div>
                  <div className={styles.col}>
                    <label className={styles.formLabel}>Min Age</label>
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={formData.minAge || 18}
                      onChange={e => {
                        const value = parseInt(e.target.value || '18');
                        if (value >= 18 && value <= 60) setFormData({ ...formData, minAge: value });
                      }}
                      className={errors.minAge ? styles.formInputError : styles.formInput}
                    />
                    {errors.minAge && <div className={styles.errorText}>{errors.minAge}</div>}
                  </div>
                  <div className={styles.col}>
                    <label className={styles.formLabel}>Max Age</label>
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={formData.maxAge || 60}
                      onChange={e => {
                        const value = parseInt(e.target.value || '60');
                        if (value >= 18 && value <= 60) setFormData({ ...formData, maxAge: value });
                      }}
                      className={errors.maxAge ? styles.formInputError : styles.formInput}
                    />
                    {errors.maxAge && <div className={styles.errorText}>{errors.maxAge}</div>}
                  </div>
                  {errors.ageRange && <div className={styles.errorText} style={{ flex: '1 1 100%' }}>{errors.ageRange}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Select Qualifications *</label>
                  <div className={errors.qualificationIds ? styles.checkboxGroupError : styles.checkboxGroup}>
                    {qualifications.map(q => (
                      <label key={q.id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.qualificationIds.includes(q.id)}
                          onChange={() => {
                            const arr = formData.qualificationIds.includes(q.id) ? formData.qualificationIds.filter(id => id !== q.id) : [...formData.qualificationIds, q.id];
                            setFormData({ ...formData, qualificationIds: arr });
                          }}
                          className={styles.checkboxItem}
                        />
                        <span style={{ fontSize: '14px' }}>{q.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.qualificationIds && <div className={styles.errorText}>{errors.qualificationIds}</div>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Select Streams</label>
                  <div className={styles.checkboxGroup}>
                    {streams.map(s => (
                      <label key={s.id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.streamIds.includes(s.id)}
                          onChange={() => {
                            const arr = formData.streamIds.includes(s.id) ? formData.streamIds.filter(id => id !== s.id) : [...formData.streamIds, s.id];
                            setFormData({ ...formData, streamIds: arr });
                          }}
                          className={styles.checkboxItem}
                        />
                        <span style={{ fontSize: '14px' }}>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Select Languages *</label>
                  {languagesLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px', fontSize: '14px', color: '#6b7280' }}>Loading languages...</div>
                  ) : (
                    <div className={styles.checkboxGroup} style={{ maxHeight: '120px' }}>
                      {languages.map(lang => (
                        <label key={lang.id} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(lang.id)}
                            onChange={() => handleLanguageToggle(lang.id)}
                            disabled={isTranslating}
                            className={styles.checkboxItem}
                          />
                          <span style={{ fontSize: '14px' }}>{lang.name} ({lang.code})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {(formData.names || []).length > 0 && (
                  <div className={styles.translationBox}>
                    <h4 className={styles.translationBoxTitle}>Translated Content:</h4>
                    {(formData.names || []).map((name, idx) => {
                      const lang = languages.find(l => l.id === name.languageId);
                      return (
                        <div key={idx} className={styles.translationItem}>
                          <p className={styles.translationLang}>
                            {lang?.name} ({lang?.code})
                          </p>
                          <p className={styles.translationText}>
                            <strong>Name:</strong> {name.name}
                          </p>
                          <p className={styles.translationText}>
                            <strong>Description:</strong> {name.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isInternationalFlag}
                      disabled={formData.countryCode === 'IN'}
                      onChange={e => setIsInternationalFlag(e.target.checked)}
                      className={styles.checkboxItem}
                    />
                    <span style={{ fontSize: '14px' }}>International Exam</span>
                  </label>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditingExam(null); setErrors({}); }}
                    className={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTranslating}
                    className={`${styles.primaryButton} ${isTranslating ? styles.primaryButtonDisabled : ''}`}
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
        <div className={styles.cropperOverlay}>
          <div className={styles.cropperModal}>
            <h3 className={styles.cropperTitle}>Crop Image</h3>
            <div className={styles.cropperContainer}>
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
              <label className={styles.formLabel}>Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className={styles.zoomInput}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={handleCropCancel}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className={styles.primaryButton}
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
