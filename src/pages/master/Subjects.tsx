import { useState, useEffect } from 'react';
import { subjectApi, SubjectDto, CreateSubjectDto, UpdateSubjectDto, SubjectNameDto, languageApi, LanguageDto } from '@/services/masterApi';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import Loader from '@/components/Loader';

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const languageMap: { [key: string]: string } = {
      'en': 'en',
      'hi': 'hi',
      'es': 'es',
      'fr': 'fr',
      'de': 'de',
      'zh': 'zh',
      'ja': 'ja',
      'ar': 'ar',
      'pt': 'pt',
      'ru': 'ru'
    };

    const targetLang = languageMap[targetLanguage] || targetLanguage;

    // Using Google Translate API
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }

    return text; // Fallback to original text if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text
  }
};

const Subjects = () => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguageIdFilter, setSelectedLanguageIdFilter] = useState<number>(50); // Default to English (ID 50)
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [formData, setFormData] = useState<CreateSubjectDto>({
    name: '',
    description: '',
    names: [],
    isActive: true
  });

  
  useEffect(() => {
    fetchSubjects();
    fetchLanguages();
  }, [selectedLanguageIdFilter]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectApi.getAll(selectedLanguageIdFilter);
      
      console.log('=== SUBJECTS API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      if (response.data) {
        let subjectsData: any[] = [];
        
        if (Array.isArray(response.data)) {
          // Direct array response
          console.log('Direct array response detected');
          subjectsData = response.data;
        } else if (response.data.success && response.data.data) {
          // Wrapped response with success and data
          console.log('Wrapped response with success detected');
          subjectsData = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Response with data property containing array
          console.log('Response with data property detected');
          subjectsData = response.data.data;
        } else {
          console.log('Unexpected response structure:', response.data);
          subjectsData = [];
        }
        
        // Map subjectLanguages to names for consistency
        const mappedSubjects = subjectsData.map((subject: any) => ({
          ...subject,
          names: subject.subjectLanguages || []
        }));
        
        console.log('Mapped subjects:', mappedSubjects);
        setSubjects(mappedSubjects);
        
      } else {
        console.log('No response data');
        // Add fallback subjects for testing
        const fallbackSubjects = [
          {
            id: 1,
            name: "Mathematics",
            description: "Mathematics subject",
            isActive: true,
            createdAt: "2026-02-24T14:36:52.27",
            updatedAt: "2026-02-24T09:06:52.27",
            subjectLanguages: []
          },
          {
            id: 2,
            name: "Physics",
            description: "Physics subject",
            isActive: true,
            createdAt: "2026-02-24T14:36:52.27",
            updatedAt: "2026-02-24T09:06:52.27",
            subjectLanguages: []
          }
        ];
        
        const mappedFallback = fallbackSubjects.map((subject: any) => ({
          ...subject,
          names: subject.subjectLanguages || []
        }));
        
        setSubjects(mappedFallback);
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      
      // Handle different response structures
      if (response.data) {
        if (Array.isArray(response.data)) {
          // Direct array response
          setLanguages(response.data);
        } else if (response.data.success && response.data.data) {
          // Wrapped response with success and data
          setLanguages(response.data.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Response with data property containing array
          setLanguages(response.data.data);
        } else {
          console.log('Unexpected language response structure:', response.data);
          setLanguages([]);
        }
      } else {
        console.log('No language response data');
        setLanguages([]);
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  const handleAutoTranslate = async () => {
    if (!autoTranslate || !formData.name) return;
    
    setIsTranslating(true);
    try {
      const translations: SubjectNameDto[] = [];
      
      for (const language of languages) {
        if (language.id !== 1) { // Skip English (assuming ID 1 is English)
          const translatedName = await translateText(formData.name, language.code);
          const translatedDescription = formData.description ? await translateText(formData.description, language.code) : '';
          
          translations.push({
            languageId: language.id,
            name: translatedName,
            description: translatedDescription
          });
        }
      }
      
      setFormData(prev => ({
        ...prev,
        names: translations
      }));
    } catch (error) {
      console.error('Auto-translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (autoTranslate && formData.name && languages.length > 0) {
      const timer = setTimeout(() => {
        handleAutoTranslate();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData.name, formData.description, autoTranslate, languages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('=== SUBMITTING SUBJECT ===');
      console.log('Form data:', formData);
      console.log('Editing subject:', editingSubject);
      
      // Transform data to match API expectations
      const apiData = {
        ...formData,
        subjectLanguages: formData.names || [] // Map names to subjectLanguages
      };
      console.log('API data:', apiData);
      
      if (editingSubject) {
        console.log('Updating subject with ID:', editingSubject.id);
        const response = await subjectApi.update(editingSubject.id, apiData);
        console.log('Update response:', response);
      } else {
        console.log('Creating new subject');
        const response = await subjectApi.create(apiData);
        console.log('Create response:', response);
      }
      fetchSubjects();
      resetForm();
    } catch (error: any) {
      console.error('Error saving subject:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
    }
  };

  const handleEdit = (subject: SubjectDto) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || '',
      names: subject.names,
      isActive: subject.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to disable this subject?')) {
      try {
        await subjectApi.updateStatus(id, false); // Disable instead of delete
        fetchSubjects();
      } catch (error) {
        console.error('Error disabling subject:', error);
      }
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: boolean) => {
    try {
      await subjectApi.updateStatus(id, !currentStatus);
      fetchSubjects();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      names: [],
      isActive: true
    });
    setEditingSubject(null);
    setShowModal(false);
    setSelectedLanguages([]);
  };

  const addLanguageTranslation = () => {
    const newTranslation: SubjectNameDto = {
      languageId: 2, // Default to Hindi
      name: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      names: [...(prev.names || []), newTranslation]
    }));
  };

  const updateTranslation = (index: number, field: keyof SubjectNameDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      names: prev.names?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ) || []
    }));
  };

  const removeTranslation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      names: prev.names?.filter((_, i) => i !== index) || []
    }));
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          subject.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!selectedLanguageIdFilter) return matchesSearch;
    
    // Show subjects if they have the selected language OR if they have no languages at all
    const hasLanguage = subject.names?.some(name => name.languageId === selectedLanguageIdFilter) ?? false;
    const hasNoLanguages = !subject.names || subject.names.length === 0;
    return matchesSearch && (hasLanguage || hasNoLanguages);
  });

  console.log('=== DEBUG INFO ===');
  console.log('Total subjects:', subjects.length);
  console.log('Filtered subjects:', filteredSubjects.length);
  console.log('Search term:', searchTerm);
  console.log('Selected language filter:', selectedLanguageIdFilter);
  console.log('Subjects:', subjects);
  console.log('Filtered subjects list:', filteredSubjects);

  // Get unique languages from subjects data
  const getUniqueLanguagesFromSubjects = () => {
    const languageMap = new Map();
    subjects.forEach(subject => {
      if (subject.names && Array.isArray(subject.names)) {
        subject.names.forEach(name => {
          if (!languageMap.has(name.languageId)) {
            languageMap.set(name.languageId, {
              id: name.languageId,
              code: name.languageCode || `lang${name.languageId}`,
              name: name.languageName || `Language ${name.languageId}`
            });
          }
        });
      }
    });
    return Array.from(languageMap.values());
  };

  const getSubjectNameForLanguage = (subject: SubjectDto, languageId: number) => {
    const translation = subject.names?.find(name => name.languageId === languageId);
    return translation ? translation.name : subject.name;
  };

  const getSubjectDescriptionForLanguage = (subject: SubjectDto, languageId: number) => {
    const translation = subject.names?.find(name => name.languageId === languageId);
    return translation ? translation.description : subject.description;
  };

  const availableLanguages = languages; // Use languages from API instead of from subjects data

  
  if (loading) {
    return <Loader text="Loading subjects..." />;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 600, marginBottom: '8px' }}>Subjects</h3>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            Manage academic subjects with multi-language support
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
          {/* Language Filter */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageFilter(!showLanguageFilter)}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{selectedLanguageIdFilter ? (availableLanguages.find((l: any) => l.id === selectedLanguageIdFilter)?.name || 'Language') : 'All Languages'}</span>
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>
            
            {showLanguageFilter && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <div
                  onClick={() => {
                    setSelectedLanguageIdFilter(50); // Reset to English
                    setShowLanguageFilter(false);
                  }}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '14px'
                  }}
                >
                  All Languages
                </div>
                {availableLanguages.map((language) => (
                  <div
                    key={language.id}
                    onClick={() => {
                      setSelectedLanguageIdFilter(language.id);
                      setShowLanguageFilter(false);
                    }}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f3f4f6',
                      fontSize: '14px'
                    }}
                  >
                    {language.name}
                  </div>
                ))}
                {selectedLanguageIdFilter && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
                    <button
                      onClick={() => {
                        setSelectedLanguageIdFilter(50); // Reset to English
                        setShowLanguageFilter(false);
                      }}
                      style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              resetForm();
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
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: "#fff",
        borderRadius: 13,
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1e40af" }}>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Description</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Languages</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Created</th>
                <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr 
                  key={subject.id} 
                  style={{ 
                    borderBottom: "1.5px solid #C0C0C0",
                    backgroundColor: subject.isActive ? "transparent" : "#f5f5f5",
                    opacity: subject.isActive ? 1 : 0.6
                  }}
                >
                  <td style={{ padding: "12px", fontSize: "14px" }}>{subject.id}</td>
                  <td style={{ padding: "12px", fontSize: "14px", fontWeight: 500 }}>
                    {getSubjectNameForLanguage(subject, selectedLanguageIdFilter)}
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    {(() => {
                      const desc = getSubjectDescriptionForLanguage(subject, selectedLanguageIdFilter);
                      return desc ? (desc.length > 50 ? `${desc.substring(0, 50)}...` : desc) : '-';
                    })()}
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {(() => {
                        const currentLang = subject.names?.find(name => name.languageId === selectedLanguageIdFilter);
                        if (currentLang) {
                          const language = languages.find(lang => lang.id === currentLang.languageId);
                          return (
                            <span
                              key={currentLang.languageId}
                              style={{
                                padding: "2px 6px",
                                background: "#dbeafe",
                                color: "#1e40af",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "500"
                              }}
                            >
                              {language?.name || currentLang.languageName || `Language ${currentLang.languageId}`}
                            </span>
                          );
                        } else {
                          // Show default language (English) or "No translation"
                          const defaultLang = languages.find(lang => lang.id === 50); // English ID 50
                          return (
                            <span
                              style={{
                                padding: "2px 6px",
                                background: defaultLang ? "#dbeafe" : "#f3f4f6",
                                color: defaultLang ? "#1e40af" : "#6b7280",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "500"
                              }}
                            >
                              {defaultLang?.name || "English"}
                            </span>
                          );
                        }
                      })()}
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    <button
                      onClick={() => handleStatusToggle(subject.id, subject.isActive)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: subject.isActive ? '#10B981' : '#EF4444',
                        color: 'white',
                        fontWeight: 500
                      }}
                    >
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    {new Date(subject.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>
                    <button
                      onClick={() => handleEdit(subject)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}
                    >
                      <img src={editIcon} alt="Edit" style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title={subject.isActive ? "Disable Subject" : "Enable Subject"}
                    >
                      <img src={deleteIcon} alt={subject.isActive ? "Disable" : "Enable"} style={{ width: '16px', height: '16px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              {searchTerm ? 'No subjects found matching your search.' : 'No subjects available. Add your first subject to get started.'}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600 }}>
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Auto-translate toggle */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  Auto-translate to all languages
                </label>
                {isTranslating && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Translating...
                  </div>
                )}
              </div>

              {/* Multi-language support */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Language Translations
                  </label>
                  <button
                    type="button"
                    onClick={addLanguageTranslation}
                    style={{
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Translation
                  </button>
                </div>

                {formData.names?.map((translation, index) => (
                  <div key={index} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <select
                        value={translation.languageId}
                        onChange={(e) => updateTranslation(index, 'languageId', Number(e.target.value))}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        {languages.map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTranslation(index)}
                        style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Translated name"
                      value={translation.name}
                      onChange={(e) => updateTranslation(index, 'name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginBottom: '8px'
                      }}
                    />
                    <textarea
                      placeholder="Translated description"
                      value={translation.description || ''}
                      onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    style={{ margin: 0 }}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
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
  );
};

export default Subjects;
