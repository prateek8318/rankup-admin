import { useState, useEffect } from 'react';
import {
  qualificationApi
} from '@/services/qualificationApi';
import { languageApi } from '@/services/masterApi';
import {
  StreamDto,
  CreateStreamDto,
  UpdateStreamDto,
  StreamName,
  QualificationDto,
  LanguageDto
} from '@/types/qualification';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

// Translation function using Google Translate API (free tier)
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // Map language codes to Google Translate language codes
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

    // Using Google Translate API (you might need to set up API key)
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

const Streams = () => {
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguageIdFilter, setSelectedLanguageIdFilter] = useState<number | undefined>(undefined);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStream, setEditingStream] = useState<StreamDto | null>(null);
  const [selectedQualification, setSelectedQualification] = useState<number>(0);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [formData, setFormData] = useState<CreateStreamDto>({
    name: '',
    description: '',
    qualificationId: 0,
    names: []
  });

  useEffect(() => {
    fetchData();
    fetchLanguages();
  }, [selectedLanguageIdFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedLanguageIdFilter) params.languageId = selectedLanguageIdFilter;
      const [streamsData, qualificationsData] = await Promise.all([
        qualificationApi.getAllStreams(params),
        qualificationApi.getAllQualifications(params)
      ]);
      setStreams(streamsData);
      setQualifications(qualificationsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      if (response.data) {
        if (response.data.success && response.data.data) {
          setLanguages(response.data.data);
        } else if (Array.isArray(response.data)) {
          setLanguages(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setLanguages(response.data.data);
        } else {
          setLanguages([]);
        }
      } else if (response && Array.isArray(response)) {
        setLanguages(response);
      } else {
        setLanguages([]);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  const handleLanguageToggle = (languageId: number) => {
    const names = formData.names || [];
    const isCurrentlySelected = selectedLanguages.includes(languageId);
    
    if (isCurrentlySelected) {
      // Remove language
      setSelectedLanguages(prev => prev.filter(id => id !== languageId));
      setFormData({ 
        ...formData, 
        names: names.filter(n => n.languageId !== languageId)
      });
    } else {
      // Add language and auto-translate if autoTranslate is enabled
      setSelectedLanguages(prev => [...prev, languageId]);
      
      const addLanguageWithTranslation = async () => {
        setIsTranslating(true);
        try {
          const language = languages.find(l => l.id === languageId);
          if (language) {
            const translatedName = language.code === 'en' 
              ? formData.name 
              : await translateText(formData.name, language.code);
            const translatedDescription = language.code === 'en'
              ? formData.description
              : await translateText(formData.description, language.code);
            
            setFormData({ 
              ...formData, 
              names: [...names, { 
                languageId, 
                name: translatedName, 
                description: translatedDescription 
              }]
            });
          }
        } finally {
          setIsTranslating(false);
        }
      };
      
      if (autoTranslate && formData.name && formData.description) {
        addLanguageWithTranslation();
      } else {
        // Just add the language without translation
        setFormData({ 
          ...formData, 
          names: [...names, { 
            languageId, 
            name: formData.name, 
            description: formData.description 
          }]
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.qualificationId) {
      alert('Please fill all required fields');
      return;
    }

    if (selectedLanguages.length === 0) {
      alert('Please select at least one language');
      return;
    }

    try {
      if (editingStream) {
        await qualificationApi.updateStream(editingStream.id.toString(), {
          ...formData,
          id: editingStream.id
        });
      } else {
        await qualificationApi.createStream(formData);
      }
      
      fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save stream:', error);
      alert('Failed to save stream');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      qualificationId: 0,
      names: []
    });
    setSelectedLanguages([]);
    setSelectedQualification(0);
    setEditingStream(null);
  };

  const handleEdit = (stream: StreamDto) => {
    setEditingStream(stream);
    setFormData({
      name: stream.name,
      description: stream.description,
      qualificationId: stream.qualificationId,
      names: stream.names
    });
    setSelectedQualification(stream.qualificationId);
    setSelectedLanguages(stream.names.map(n => n.languageId));
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      try {
        await qualificationApi.deleteStream(id.toString());
        fetchData();
      } catch (error) {
        console.error('Failed to delete stream:', error);
        alert('Failed to delete stream');
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await qualificationApi.toggleStreamStatus(id.toString(), !currentStatus);
      fetchData();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to toggle status');
    }
  };

  const filteredStreams = streams.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.qualificationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQualificationName = (qualificationId: number) => {
    const qualification = qualifications.find(q => q.id === qualificationId);
    return qualification?.name || 'Unknown';
  };

  return (
    <div>
      {/* HEADER ACTIONS */}
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
            placeholder="Search streams..."
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
          {/* Language Filter Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageFilter(!showLanguageFilter)}
              style={{
                padding: '10px 16px',
                minWidth: '200px',
                textAlign: 'left',
                border: selectedLanguageIdFilter ? '2px solid #2563eb' : '1px solid #d1d5db',
                borderRadius: '10px',
                background: selectedLanguageIdFilter ? '#eff6ff' : '#fff',
                color: selectedLanguageIdFilter ? '#2563eb' : '#374151',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontWeight: 600 }}>Language</span>
              <span style={{ opacity: 0.8, fontSize: '13px' }}>{selectedLanguageIdFilter ? `(${languages.find(l => l.id === selectedLanguageIdFilter)?.name})` : 'All'}</span>
            </button>

            {showLanguageFilter && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e6eef8',
                borderRadius: '10px',
                padding: '8px',
                marginTop: '8px',
                boxShadow: '0 8px 24px rgba(14,30,37,0.08)',
                zIndex: 1000,
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                  Select Language (Single)
                </div>
                {languages.map((lang) => {
                  const isSelected = selectedLanguageIdFilter === lang.id;
                  return (
                    <div
                      key={lang.id}
                      onClick={() => { setSelectedLanguageIdFilter(prev => prev === lang.id ? undefined : lang.id); setShowLanguageFilter(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        marginBottom: '6px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: isSelected ? '#eef6ff' : '#fbfdff',
                        border: isSelected ? '1px solid #c7e0ff' : '1px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: isSelected ? '#2563eb' : '#eef2ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#fff' : '#2563eb',
                          fontSize: 12,
                          fontWeight: 700
                        }}>{lang.code.toUpperCase()}</div>
                        <div style={{ fontSize: '14px', color: '#0f172a' }}>{lang.name}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{lang.nativeName}</div>
                    </div>
                  );
                })}
                {selectedLanguageIdFilter && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setSelectedLanguageIdFilter(undefined)}
                      style={{
                        marginTop: '6px',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '8px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '13px',
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
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
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
            Add Stream
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{
        background: "#fff",
        borderRadius: 13,
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
            Loading streams...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1e40af" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Description</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Qualification</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Languages</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Created</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStreams.map((stream) => (
                  <tr key={stream.id} style={{ borderBottom: "1.5px solid #C0C0C0" }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{stream.id}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{stream.name}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{stream.description}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{stream.qualificationName}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {stream.names.map((name) => (
                          <span
                            key={name.languageId}
                            style={{
                              padding: "2px 6px",
                              background: "#dbeafe",
                              color: "#1e40af",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "500"
                            }}
                          >
                            {name.languageCode || name.languageId}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: stream.isActive ? "#dcfce7" : "#fee2e2",
                        color: stream.isActive ? "#166534" : "#991b1b"
                      }}>
                        {stream.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {new Date(stream.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEdit(stream)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          cursor: "pointer",
                          marginRight: "8px",
                          padding: "4px"
                        }}
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" style={{ width: "16px", height: "16px" }} />
                      </button>
                      <button
                        onClick={() => handleDelete(stream.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          padding: "4px"
                        }}
                        title="Delete"
                      >
                        <img src={deleteIcon} alt="Delete" style={{ width: "16px", height: "16px" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 13,
            padding: "30px",
            width: "600px",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600" }}>
              {editingStream ? "Edit Stream" : "Add Stream"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Name *
                  {isTranslating && (
                    <span style={{ marginLeft: "8px", fontSize: "12px", color: "#6b7280" }}>
                      (Translating...)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    
                    // Auto-translate to all selected languages when main name changes
                    if (formData.names && formData.names.length > 0 && e.target.value.trim()) {
                      const translateToAllLanguages = async () => {
                        setIsTranslating(true);
                        try {
                          const translatedNames = await Promise.all(
                            (formData.names || []).map(async (nameObj) => {
                              const language = languages.find(l => l.id === nameObj.languageId);
                              if (language && language.code !== 'en') {
                                const translatedName = await translateText(e.target.value, language.code);
                                return { ...nameObj, name: translatedName };
                              }
                              return nameObj;
                            })
                          );
                          
                          setFormData({ ...formData, name: e.target.value, names: translatedNames });
                        } finally {
                          setIsTranslating(false);
                        }
                      };
                      
                      translateToAllLanguages();
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    
                    // Auto-translate to all selected languages when main description changes
                    if (formData.names && formData.names.length > 0 && e.target.value.trim()) {
                      const translateToAllLanguages = async () => {
                        setIsTranslating(true);
                        try {
                          const translatedDescriptions = await Promise.all(
                            (formData.names || []).map(async (nameObj) => {
                              const language = languages.find(l => l.id === nameObj.languageId);
                              if (language && language.code !== 'en') {
                                const translatedDescription = await translateText(e.target.value, language.code);
                                return { ...nameObj, description: translatedDescription };
                              }
                              return nameObj;
                            })
                          );
                          
                          setFormData({ ...formData, description: e.target.value, names: translatedDescriptions });
                        } finally {
                          setIsTranslating(false);
                        }
                      };
                      
                      translateToAllLanguages();
                    }
                  }}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Select Qualification *
                </label>
                <select
                  value={formData.qualificationId}
                  onChange={(e) => {
                    const qualificationId = parseInt(e.target.value);
                    setSelectedQualification(qualificationId);
                    setFormData({ ...formData, qualificationId });
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: "#fff"
                  }}
                >
                  <option value={0}>Choose a qualification...</option>
                  {qualifications.map((qualification) => (
                    <option key={qualification.id} value={qualification.id}>
                      {qualification.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "500" }}>
                    Select Languages *
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      id="autoTranslate"
                      checked={autoTranslate}
                      onChange={(e) => setAutoTranslate(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <label htmlFor="autoTranslate" style={{ fontSize: "12px", color: "#6b7280" }}>
                      Auto-translate
                    </label>
                  </div>
                </div>
                {languagesLoading ? (
                  <div style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#6b7280" }}>
                    Loading languages...
                  </div>
                ) : (
                  <div style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                    maxHeight: "120px",
                    overflowY: "auto"
                  }}>
                    {languages.map((language) => (
                      <label key={language.id} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px", 
                        padding: "4px 0",
                        cursor: "pointer"
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language.id)}
                          onChange={() => handleLanguageToggle(language.id)}
                          style={{ width: "16px", height: "16px" }}
                        />
                        <span style={{ fontSize: "14px" }}>{language.name} ({language.nativeName})</span>
                      </label>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  Select multiple languages for stream name and description translations.
                </p>
              </div>

              {formData.names.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                    Stream Names and Descriptions by Language *
                  </label>
                  <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px" }}>
                    {formData.names.map((name) => {
                      const language = languages.find(l => l.id === name.languageId);
                      return (
                        <div key={name.languageId} style={{ marginBottom: "12px", padding: "8px", background: "#f9fafb", borderRadius: "6px" }}>
                          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                            {language?.name} ({language?.nativeName})
                          </div>
                          <div style={{ marginBottom: "4px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "500" }}>Name:</label>
                            <input
                              type="text"
                              required
                              value={name.name}
                              onChange={(e) => {
                                const updatedNames = [...formData.names];
                                const index = updatedNames.findIndex(n => n.languageId === name.languageId);
                                updatedNames[index] = { ...name, name: e.target.value };
                                setFormData({ ...formData, names: updatedNames });
                              }}
                              style={{
                                width: "100%",
                                padding: "4px 6px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginTop: "2px"
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: "500" }}>Description:</label>
                            <textarea
                              required
                              value={name.description}
                              onChange={(e) => {
                                const updatedNames = [...formData.names];
                                const index = updatedNames.findIndex(n => n.languageId === name.languageId);
                                updatedNames[index] = { ...name, description: e.target.value };
                                setFormData({ ...formData, names: updatedNames });
                              }}
                              rows={2}
                              style={{
                                width: "100%",
                                padding: "4px 6px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginTop: "2px",
                                resize: "vertical"
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    background: "#fff",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTranslating}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                    opacity: isTranslating ? 0.5 : 1
                  }}
                >
                  {isTranslating ? 'Translating...' : (editingStream ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Streams;
