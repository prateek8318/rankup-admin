import { useState, useEffect } from 'react';
import { languageApi, LanguageDto, CreateLanguageDto, UpdateLanguageDto } from '@/services/masterApi';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

const Languages = () => {
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageDto | null>(null);
  const [formData, setFormData] = useState<CreateLanguageDto>({
    name: '',
    code: '',
    isActive: true
  });

  // Predefined language codes with names and native script translations
  const languageOptions = [
     { name: 'Hindi', code: 'hi', nativeName: 'हिंदी' },
  { name: 'Bengali', code: 'bn', nativeName: 'বাংলা' },
  { name: 'Tamil', code: 'ta', nativeName: 'தமிழ்' },
  { name: 'Telugu', code: 'te', nativeName: 'తెలుగు' },
  { name: 'Marathi', code: 'mr', nativeName: 'मराठी' },
  { name: 'Gujarati', code: 'gu', nativeName: 'ગુજરાતી' },
  { name: 'Punjabi', code: 'pa', nativeName: 'ਪੰਜਾਬੀ' },
  { name: 'Urdu', code: 'ur', nativeName: 'اردو' },
  { name: 'Malayalam', code: 'ml', nativeName: 'മലയാളം' },
  { name: 'Kannada', code: 'kn', nativeName: 'ಕನ್ನಡ' },
  { name: 'Odia', code: 'or', nativeName: 'ଓଡ଼ିଆ' },
  { name: 'Assamese', code: 'as', nativeName: 'অসমীয়া' },
  { name: 'Nepali', code: 'ne', nativeName: 'नेपाली' },
  { name: 'Sanskrit', code: 'sa', nativeName: 'संस्कृतम्' },
  { name: 'Sindhi', code: 'sd', nativeName: 'سنڌي' },
  { name: 'Konkani', code: 'kok', nativeName: 'कोंकणी' },
  { name: 'Manipuri (Meitei)', code: 'mni', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  { name: 'Bodo', code: 'brx', nativeName: 'बड़ो' },
  { name: 'Dogri', code: 'doi', nativeName: 'डोगरी' },
  { name: 'Maithili', code: 'mai', nativeName: 'मैथिली' },
  { name: 'Santali', code: 'sat', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { name: 'Kashmiri', code: 'ks', nativeName: 'कश्मीरी / کشمیری' },

  // Widely Spoken Regional Languages
  { name: 'Tulu', code: 'tcy', nativeName: 'ತುಳು' },
  { name: 'Bhojpuri', code: 'bho', nativeName: 'भोजपुरी' },
  { name: 'Rajasthani', code: 'raj', nativeName: 'राजस्थानी' },
  { name: 'Haryanvi', code: 'bgc', nativeName: 'हरियाणवी' },
  { name: 'Chhattisgarhi', code: 'hne', nativeName: 'छत्तीसगढ़ी' },
  { name: 'Garhwali', code: 'gbm', nativeName: 'गढ़वाली' },
  { name: 'Kumaoni', code: 'kfy', nativeName: 'कुमाऊँनी' },
  { name: 'Magahi', code: 'mag', nativeName: 'मगही' },
  { name: 'Angika', code: 'anp', nativeName: 'अंगिका' },
  { name: 'Awadhi', code: 'awa', nativeName: 'अवधी' },
  { name: 'Bundeli', code: 'bns', nativeName: 'बुंदेली' },
  { name: 'Bagheli', code: 'bfy', nativeName: 'बघेली' },
  { name: 'Ladakhi', code: 'lbj', nativeName: 'ལ་དྭགས་སྐད་' },
  { name: 'Gondi', code: 'gon', nativeName: 'गोंडी' },
  { name: 'Bhili', code: 'bhb', nativeName: 'भीली' },
  { name: 'Khasi', code: 'kha', nativeName: 'खासी' },
  { name: 'Mizo (Lushai)', code: 'lus', nativeName: 'Mizo ṭawng' },
  { name: 'Ao', code: 'njo', nativeName: 'Ao' },
  { name: 'Nyishi', code: 'nyi', nativeName: 'Nyishi' },
  { name: 'Lepcha', code: 'lep', nativeName: 'ᰛᰩᰵᰛᰵ' },
  { name: 'Kokborok', code: 'trp', nativeName: 'Kokborok' },
  { name: 'Ho', code: 'hoc', nativeName: 'ᱦᱳ' },
  { name: 'Kurukh (Oraon)', code: 'kru', nativeName: 'कुड़ुख' },
  { name: 'Mundari', code: 'unr', nativeName: 'मुंडारी' },
  { name: 'Sora', code: 'srb', nativeName: 'ସୋରା' },
  { name: 'Nicobarese', code: 'ncb', nativeName: 'Nicobarese' },
  { name: 'Kodava', code: 'kfa', nativeName: 'ಕೊಡವ' },
  { name: 'Badaga', code: 'bfq', nativeName: 'ಬಡಗ' },
  { name: 'Pahari', code: 'phr', nativeName: 'पहाड़ी' },
  { name: 'Marwari', code: 'mwr', nativeName: 'मारवाड़ी' },
  { name: 'Mewari', code: 'mtr', nativeName: 'मेवाड़ी' },
  { name: 'Dhundhari', code: 'dhd', nativeName: 'ढूंढाड़ी' },
  { name: 'Khandeshi', code: 'khn', nativeName: 'खानदेशी' },
  { name: 'Surjapuri', code: 'sjp', nativeName: 'सुरजापुरी' },
  { name: 'Dimasa', code: 'dis', nativeName: 'Dimasa' },
  { name: 'Karbi', code: 'mjw', nativeName: 'Karbi' },
  { name: 'Garo', code: 'grt', nativeName: 'Garo' }
  ];

  // Filter out already used language codes (case-insensitive)
  const availableLanguageOptions = languageOptions.filter(option => 
    !languages.some(lang => lang.code.toLowerCase() === option.code.toLowerCase()) || 
    (editingLanguage && editingLanguage.code.toLowerCase() === option.code.toLowerCase())
  );

  // For edit mode, include the current language being edited (case-insensitive)
  const dropdownOptions = editingLanguage 
    ? languageOptions.filter(option => 
        !languages.some(lang => lang.code.toLowerCase() === option.code.toLowerCase() && lang.id !== editingLanguage.id) || 
        editingLanguage.code.toLowerCase() === option.code.toLowerCase()
      )
    : availableLanguageOptions;

  // Validate form submission
  const isFormValid = () => {
    if (!formData.name || !formData.code) return false;
    if (isCustomMode && (formData.code === 'custom' || !isCustomCodeValid)) return false;
    return true;
  };

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await languageApi.getAll();
      console.log('Languages API Response:', response); // Debug log
      // Handle different response structures
      if (response.data) {
        // Check if response.data has success property (API response format)
        if (response.data.success && response.data.data) {
          console.log('API response format detected, using response.data.data');
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!isFormValid()) {
      alert('Please fill all required fields with valid data.');
      return;
    }

    try {
      if (editingLanguage) {
        await languageApi.update(editingLanguage.id, formData as UpdateLanguageDto);
      } else {
        await languageApi.create(formData);
      }
      fetchLanguages();
      resetForm();
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleEdit = (language: LanguageDto) => {
    setEditingLanguage(language);
    setFormData({
      name: language.name,
      code: language.code,
      isActive: language.isActive
    });
    setShowModal(true);
  };

  // Handle language selection from dropdown
  const handleLanguageSelect = (selectedCode: string) => {
    console.log('Language selected:', selectedCode); // Debug log
    if (selectedCode === 'custom') {
      // Enable custom language input
      setFormData({
        ...formData,
        name: '',
        code: 'custom' // Set to 'custom' to trigger custom mode
      });
    } else {
      const selectedLanguage = languageOptions.find(opt => opt.code === selectedCode);
      if (selectedLanguage) {
        // Auto-fill with bilingual name: "English / English" or "Gujarati / ગુજરાતી"
        const bilingualName = `${selectedLanguage.name} / ${selectedLanguage.nativeName}`;
        setFormData({
          ...formData,
          name: bilingualName,
          code: selectedLanguage.code
        });
      }
    }
  };

  // Validate custom language code (case-insensitive)
  const isCustomCodeValid = formData.code && 
    formData.code !== 'custom' &&
    !languageOptions.some(opt => opt.code.toLowerCase() === formData.code.toLowerCase()) &&
    !languages.some(lang => lang.code.toLowerCase() === formData.code.toLowerCase());

  // Check if form is in custom mode
  const isCustomMode = formData.code === 'custom' || 
    (formData.code && 
     !languageOptions.some(opt => opt.code === formData.code) && 
     !editingLanguage);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this language?')) {
      try {
        await languageApi.updateStatus(id, false);
        fetchLanguages();
      } catch (error) {
        console.error('Error deactivating language:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', isActive: true });
    setEditingLanguage(null);
    setShowModal(false);
  };

  const filteredLanguages = languages.filter(lang =>
    lang.isActive &&
    (lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase()))
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
            placeholder="Search languages..."
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
          Add Language
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
            Loading languages...
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
                {filteredLanguages.map((language) => (
                  <tr key={language.id} style={{ borderBottom: "1.5px solid #C0C0C0" }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{language.id}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{language.name}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{language.code}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: language.isActive ? "#dcfce7" : "#fee2e2",
                        color: language.isActive ? "#166534" : "#991b1b"
                      }}>
                        {language.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      {new Date(language.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEdit(language)}
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
                        onClick={() => handleDelete(language.id)}
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
              {editingLanguage ? "Edit Language" : "Add Language"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Select Language *
                </label>
                <select
                  value={isCustomMode ? 'custom' : formData.code}
                  onChange={(e) => handleLanguageSelect(e.target.value)}
                  required
                  disabled={!!editingLanguage}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: editingLanguage ? "#f3f4f6" : "#fff",
                    color: editingLanguage ? "#6b7280" : "#000"
                  }}
                >
                  <option value="">Choose a language...</option>
                  {dropdownOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name} ({option.code})
                    </option>
                  ))}
                  {!editingLanguage && (
                    <option value="custom">+ Add Custom Language</option>
                  )}
                </select>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  {editingLanguage 
                    ? "Language selection is disabled in edit mode to maintain code consistency."
                    : "Select from predefined languages or choose 'Add Custom Language' for new languages. Native script names will be auto-filled."
                  }
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Language Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isCustomMode ? "Enter custom language name (e.g., 'Bhojpuri / भोजपुरी')..." : "Language name (auto-filled with native script)"}
                  readOnly={!isCustomMode && !editingLanguage}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: (!isCustomMode && !editingLanguage) ? "#f3f4f6" : "#fff",
                    color: (!isCustomMode && !editingLanguage) ? "#6b7280" : "#000"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Language Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                  placeholder={isCustomMode ? "Enter custom language code (e.g., 'bho' for Bhojpuri)..." : ""}
                  readOnly={!isCustomMode && !editingLanguage}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: isCustomMode && !isCustomCodeValid ? "1px solid #ef4444" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "14px",
                    backgroundColor: (!isCustomMode && !editingLanguage) ? "#f3f4f6" : "#fff",
                    color: (!isCustomMode && !editingLanguage) ? "#6b7280" : "#000"
                  }}
                />
                {isCustomMode && (
                  <p style={{ 
                    fontSize: "12px", 
                    color: isCustomCodeValid ? "#059669" : "#ef4444", 
                    marginTop: "4px" 
                  }}>
                    {isCustomCodeValid 
                      ? "✓ Custom code is available"
                      : "✗ This code already exists (case-insensitive check)"
                    }
                  </p>
                )}
                {!isCustomMode && !editingLanguage && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                    Code is auto-generated from language selection above.
                  </p>
                )}
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
                  disabled={!isFormValid()}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: isFormValid() 
                      ? "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)" 
                      : "#d1d5db",
                    color: isFormValid() ? "#fff" : "#9ca3af",
                    fontSize: "14px",
                    cursor: isFormValid() ? "pointer" : "not-allowed"
                  }}
                >
                  {editingLanguage ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Languages;
