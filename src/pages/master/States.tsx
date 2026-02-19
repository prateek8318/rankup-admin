import { useState, useEffect } from 'react';
import { stateApi, countryApi, languageApi, StateDto, CreateStateDto, UpdateStateDto, CountryDto, LanguageDto, StateNameDto } from '@/services/masterApi';
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

const States = () => {
  const [states, setStates] = useState<StateDto[]>([]);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | undefined>(undefined);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingState, setEditingState] = useState<StateDto | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateStateDto>({
    name: '',
    code: '',
    countryCode: '',
    names: [],
    isActive: true
  });

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await stateApi.getAll(selectedLanguageId || undefined, selectedCountryCode || undefined);
      console.log('States API Response:', response); // Debug log
      // Handle different response structures
      if (response.data) {
        // Check if response.data has success property (API response format)
        if (response.data.success && response.data.data) {
          console.log('API response format detected, using response.data.data');
          setStates(response.data.data);
        } else if (Array.isArray(response.data)) {
          setStates(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setStates(response.data.data);
        } else {
          setStates([]);
        }
      } else if (response && Array.isArray(response)) {
        setStates(response);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await countryApi.getAll();
      if (response.data) {
        if (response.data.success && response.data.data) {
          setCountries(response.data.data);
        } else if (Array.isArray(response.data)) {
          setCountries(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setCountries(response.data.data);
        } else {
          setCountries([]);
        }
      } else if (response && Array.isArray(response)) {
        setCountries(response);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    }
  };

  const fetchLanguages = async () => {
    try {
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
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStates(),
        fetchCountries(),
        fetchLanguages()
      ]);
      setLoading(false);
    };
    
    fetchData();
  }, [selectedLanguageId, selectedCountryCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingState) {
        await stateApi.update(editingState.id, formData as UpdateStateDto);
      } else {
        await stateApi.create(formData);
      }
      fetchStates();
      resetForm();
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const handleEdit = (state: StateDto) => {
    setEditingState(state);
    setFormData({
      name: state.name,
      code: state.code,
      countryCode: state.countryCode,
      names: state.names || [],
      isActive: state.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this state?')) {
      try {
        await stateApi.updateStatus(id, false);
        fetchStates();
      } catch (error) {
        console.error('Error deactivating state:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', countryCode: '', names: [], isActive: true });
    setEditingState(null);
    setShowModal(false);
  };

  // Helper functions to get names by code/id
  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country ? `${country.name} (${code})` : code;
  };

  const getLanguageNames = (names: StateNameDto[]) => {
    if (!names || names.length === 0) return '-';
    return names.map(name => {
      const language = languages.find(l => l.id === name.languageId);
      return language ? `${language.name}: ${name.name}` : name.name;
    }).join(', ');
  };

  const getStateDisplayName = (state: StateDto) => {
    if (selectedLanguageId) {
      const nameObj = state.names?.find(n => n.languageId === selectedLanguageId);
      return nameObj ? nameObj.name : state.name;
    }
    return state.name;
  };

  const filteredStates = states.filter(state =>
    state.isActive &&
    (getStateDisplayName(state).toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.countryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            placeholder="Search states..."
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
            value={selectedLanguageId || ''}
            onChange={(e) => setSelectedLanguageId(e.target.value ? parseInt(e.target.value) : undefined)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* <button
            onClick={async () => {
              try {
                await stateApi.seedLanguages();
                alert('State languages seeded successfully!');
                fetchStates(selectedLanguageId);
              } catch (error) {
                console.error('Error seeding state languages:', error);
              }
            }}
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Seed Languages
          </button>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete states with empty names?')) {
                try {
                  await stateApi.deleteEmptyNames();
                  alert('States with empty names deleted successfully!');
                  fetchStates(selectedLanguageId);
                } catch (error) {
                  console.error('Error deleting empty name states:', error);
                }
              }
            }}
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Delete Empty Names
          </button> */}
          <button
            onClick={() => setShowModal(true)}
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
            Add State
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
            Loading states...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1e40af" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Code</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Country</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Language</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Created</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStates.map((state) => (
                  <tr key={state.id} style={{ borderBottom: "1.5px solid #C0C0C0" }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{state.id}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{getStateDisplayName(state)}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{state.code}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{getCountryName(state.countryCode)}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{getLanguageNames(state.names)}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: state.isActive ? "#dcfce7" : "#fee2e2",
                        color: state.isActive ? "#166534" : "#991b1b"
                      }}>
                        {state.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {new Date(state.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEdit(state)}
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
                        onClick={() => handleDelete(state.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          padding: "4px"
                        }}
                        title="Deactivate"
                      >
                        <img src={deleteIcon} alt="Deactivate" style={{ width: "16px", height: "16px" }} />
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
            width: "500px",
            maxWidth: "90%"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600" }}>
              {editingState ? "Edit State" : "Add State"}
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
                  Select Country *
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
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
                  <option value="">Choose a country...</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  Select country from API data. Country code will be auto-filled.
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  State Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., BR, MH, UP"
                  maxLength={2}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                />
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  2-letter state code (e.g., BR for Bihar)
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Select Languages (Multi-Select)
                </label>
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
                        checked={formData.names?.some(n => n.languageId === language.id) || false}
                        onChange={(e) => {
                          const names = formData.names || [];
                          if (e.target.checked) {
                            // Add language and auto-translate
                            const addLanguageWithTranslation = async () => {
                              setIsTranslating(true);
                              try {
                                const translatedName = await translateText(formData.name, language.code);
                                setFormData({ 
                                  ...formData, 
                                  names: [...names, { languageId: language.id, name: translatedName }]
                                });
                              } finally {
                                setIsTranslating(false);
                              }
                            };
                            addLanguageWithTranslation();
                          } else {
                            // Remove language
                            setFormData({ 
                              ...formData, 
                              names: names.filter(n => n.languageId !== language.id)
                            });
                          }
                        }}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span style={{ fontSize: "14px" }}>{language.name}</span>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  Select multiple languages for state name translations.
                </p>
              </div>

              {formData.names && formData.names.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                    State Names by Language *
                  </label>
                  {formData.names.map((nameObj, index) => {
                    const language = languages.find(l => l.id === nameObj.languageId);
                    return (
                      <div key={nameObj.languageId} style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                          {language?.name || `Language ${nameObj.languageId}`}
                        </label>
                        <input
                          type="text"
                          required
                          value={nameObj.name}
                          onChange={(e) => {
                            const updatedNames = [...formData.names!];
                            updatedNames[index] = { ...nameObj, name: e.target.value };
                            setFormData({ ...formData, names: updatedNames });
                            
                            // Auto-translate to other languages when main name changes
                            if (index === 0) { // If editing first language entry
                              const translateToOtherLanguages = async () => {
                                setIsTranslating(true);
                                try {
                                  const otherLanguages = updatedNames.filter((_, i) => i !== 0);
                                  const translatedNames = await Promise.all(
                                    otherLanguages.map(async (nameObj) => {
                                      const language = languages.find(l => l.id === nameObj.languageId);
                                      if (language && language.code !== 'en') {
                                        const translatedName = await translateText(e.target.value, language.code);
                                        return { ...nameObj, name: translatedName };
                                      }
                                      return nameObj;
                                    })
                                  );
                                  
                                  const finalNames = [updatedNames[0], ...translatedNames];
                                  setFormData({ ...formData, names: finalNames });
                                } finally {
                                  setIsTranslating(false);
                                }
                              };
                              
                              if (e.target.value.trim()) {
                                translateToOtherLanguages();
                              }
                            }
                          }}
                          placeholder={`Enter state name in ${language?.name || 'this language'}`}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            fontSize: "14px"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: "16px", height: "16px" }}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={resetForm}
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
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  {editingState ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default States;
