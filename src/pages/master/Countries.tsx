import { useState, useEffect } from 'react';
import { countryApi, CountryDto, CreateCountryDto, UpdateCountryDto, languageApi, LanguageDto } from '@/services/masterApi';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

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

const Countries = () => {
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [formData, setFormData] = useState<CreateCountryDto>({
    name: '',
    nameEn: '',
    nameHi: '',
    code: '',
    subdivisionLabelEn: 'State',
    subdivisionLabelHi: 'राज्य',
    isActive: true
  });

  const fetchCountries = async (language?: string) => {
    try {
      setLoading(true);
      const response = await countryApi.getAll(language);
      console.log('Countries API Response:', response); // Debug log
      // Handle different response structures
      if (response.data) {
        // Check if response.data has success property (API response format)
        if (response.data.success && response.data.data) {
          console.log('API response format detected, using response.data.data');
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

  useEffect(() => {
    fetchCountries(selectedLanguage);
    fetchLanguages();
  }, [selectedLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCountry) {
        // Construct UpdateCountryDto with all required fields
        const updateData: UpdateCountryDto = {
          id: editingCountry.id,
          nameEn: formData.nameEn || formData.name || '',
          nameHi: formData.nameHi || '',
          code: formData.code || '',
          subdivisionLabelEn: formData.subdivisionLabelEn || 'State',
          subdivisionLabelHi: formData.subdivisionLabelHi || 'राज्य',
          isActive: formData.isActive !== undefined ? formData.isActive : true
        };
        await countryApi.update(editingCountry.id, updateData);
      } else {
        await countryApi.create(formData);
      }
      fetchCountries(selectedLanguage);
      resetForm();
    } catch (error) {
      console.error('Error saving country:', error);
    }
  };

  const handleEdit = (country: CountryDto) => {
    setEditingCountry(country);
    setFormData({
      name: country.nameEn || country.name, // Use nameEn or fallback to main name
      nameEn: country.nameEn || country.name,
      nameHi: country.nameHi || '',
      code: country.code,
      subdivisionLabelEn: (country as any).subdivisionLabelEn || 'State',
      subdivisionLabelHi: (country as any).subdivisionLabelHi || 'राज्य',
      isActive: country.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this country?')) {
      try {
        await countryApi.updateStatus(id, false);
        fetchCountries(selectedLanguage);
      } catch (error) {
        console.error('Error deactivating country:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      nameEn: '', 
      nameHi: '', 
      code: '', 
      subdivisionLabelEn: 'State',
      subdivisionLabelHi: 'राज्य',
      isActive: true 
    });
    setEditingCountry(null);
    setShowModal(false);
  };

  const getCountryDisplayName = (country: CountryDto) => {
    // Try nameHi first for Hindi, then fallback to nameEn, then main name
    if (selectedLanguage === 'hi') {
      return country.nameHi || country.nameEn || country.name;
    }
    return country.nameEn || country.name;
  };

  const handleNameEnChange = async (value: string) => {
    const updatedFormData = { 
      ...formData, 
      name: value, // Set main name for backend
      nameEn: value 
    };
    setFormData(updatedFormData);
    
    if (autoTranslate && value.trim()) {
      try {
        const hindiTranslation = await translateText(value, 'hi');
        setFormData(prev => ({ 
          ...prev, 
          nameHi: hindiTranslation,
          name: value // Keep main name as English
        }));
      } catch (error) {
        console.error('Auto-translation failed:', error);
      }
    }
  };

  const handleLanguageToggle = (languageId: number) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId) 
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };

  const filteredCountries = countries.filter(country =>
    (getCountryDisplayName(country).toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()))
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
            placeholder="Search countries..."
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
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'hi')}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

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
          Add Country
        </button>
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
            Loading countries...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1e40af" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Code</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Created</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.map((country) => (
                  <tr key={country.id} style={{ 
                    borderBottom: "1.5px solid #C0C0C0",
                    backgroundColor: country.isActive ? "transparent" : "#f3f4f6",
                    opacity: country.isActive ? 1 : 0.6
                  }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{country.id}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      <div>
                        <div>{getCountryDisplayName(country)}</div>
                        {selectedLanguage === 'en' && country.nameHi && (
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>{country.nameHi}</div>
                        )}
                        {selectedLanguage === 'hi' && (
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>{country.nameEn}</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{country.code}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: country.isActive ? "#dcfce7" : "#fee2e2",
                        color: country.isActive ? "#166534" : "#991b1b"
                      }}>
                        {country.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {new Date(country.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEdit(country)}
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
                      {country.isActive && (
                        <button
                          onClick={() => handleDelete(country.id)}
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
                      )}
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
              {editingCountry ? "Edit Country" : "Add Country"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Country Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
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
                  Country Name (Hindi)
                </label>
                <input
                  type="text"
                  value={formData.nameHi}
                  onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
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
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  Auto-translate to Hindi
                </label>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Active Languages (Multi-select)
                </label>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "8px",
                  maxHeight: "100px",
                  overflowY: "auto",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px"
                }}>
                  {languagesLoading ? (
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Loading languages...</div>
                  ) : (
                    languages.map((language) => (
                      <label
                        key={language.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: selectedLanguages.includes(language.id) ? "#e0e7ff" : "#f3f4f6"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language.id)}
                          onChange={() => handleLanguageToggle(language.id)}
                          style={{ width: "12px", height: "12px" }}
                        />
                        {language.name}
                      </label>
                    ))
                  )}
                </div>
              </div>

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
                  {editingCountry ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countries;
