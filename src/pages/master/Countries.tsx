import { useState, useEffect } from 'react';
import { countryApi, CountryDto, CreateCountryDto, UpdateCountryDto, languageApi, LanguageDto } from '@/services/masterApi';
import MasterHeader from '@/components/common/MasterHeader';
import MasterTable, { TableColumn } from '@/components/common/MasterTable';
import MasterModal from '@/components/common/MasterModal';
import FormActions from '@/components/common/FormActions';

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

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    {
      key: 'name',
      label: 'Name',
      render: (country) => (
        <div>
          <div>{getCountryDisplayName(country)}</div>
          {selectedLanguage === 'en' && country.nameHi && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{country.nameHi}</div>
          )}
          {selectedLanguage === 'hi' && (
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{country.nameEn}</div>
          )}
        </div>
      )
    },
    { key: 'code', label: 'Code' },
    {
      key: 'status',
      label: 'Status',
      render: (country) => (
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
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (country) => new Date(country.createdAt).toLocaleDateString()
    },
    { key: 'actions', label: 'Actions' }
  ];

  return (
    <>
      <MasterHeader
        searchPlaceholder="Search countries..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Country"
        onAddClick={() => setShowModal(true)}
        filters={[
          {
            key: 'language',
            label: 'Language',
            value: selectedLanguage,
            options: [
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिन्दी' }
            ],
            onChange: (value) => setSelectedLanguage(value as 'en' | 'hi')
          }
        ]}
      />

      <MasterTable
        columns={columns}
        data={filteredCountries}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No countries found."
        loadingMessage="Loading countries..."
      />

      {/* MODAL */}
      <MasterModal
        isOpen={showModal}
        title={editingCountry ? "Edit Country" : "Add Country"}
      >
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

          <FormActions
            onCancel={resetForm}
            submitLabel={editingCountry ? "Update" : "Create"}
          />
        </form>
      </MasterModal>
    </>
  );
};

export default Countries;
