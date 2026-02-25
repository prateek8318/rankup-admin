import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCMSList, updateCMS, deleteCMS } from '@/services/dashboardApi';
import { languageApi } from '@/services/masterApi';
import { FiEdit, FiTrash2, FiArrowLeft, FiGlobe } from 'react-icons/fi';
import MDEditor from '@uiw/react-md-editor';

// Translation function using Google Translate API (free tier)
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // Map language codes to Google Translate language codes
    const languageMap: { [key: string]: string } = {
      'hi': 'hi',
      'gu': 'gu',
      'en': 'en',
      'mr': 'mr',
      'bn': 'bn',
      'te': 'te',
      'ta': 'ta',
      'kn': 'kn',
      'ml': 'ml',
      'pa': 'pa',
      'or': 'or',
      'as': 'as'
    };

    const targetLang = languageMap[targetLanguage] || targetLanguage;

    // Using Google Translate API (you might need to set up API key)
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

interface CMSItem {
  id: string;
  key: string;
  title: string;
  content: string;
  language: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CMSDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cmsItem, setCmsItem] = useState<CMSItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    key: ''
  });
  const [selectedLanguagesForEdit, setSelectedLanguagesForEdit] = useState<string[]>(['en']); // Multi-select for edit
  const [showEditLanguageDropdown, setShowEditLanguageDropdown] = useState(false); // Dropdown visibility
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([]);

  const fetchLanguages = async () => {
    try {
      const response = await languageApi.getAll();
      if (response.data) {
        const languages = response.data.data || response.data;
        const languageOptions = languages.map((lang: any) => ({
          code: lang.code,
          name: lang.name
        }));
        setAvailableLanguages(languageOptions);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Fallback to basic languages
      setAvailableLanguages([
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' }
      ]);
    }
  };

  const fetchCMSContent = async () => {
    try {
      setLoading(true);
      // Try to get content by ID first, then by key if needed
      const response = await getCMSList({ page: 1, limit: 10, search: id, language: 'en' });
      if (response.success && response.data && response.data.length > 0) {
        const cmsItem = response.data.find((item: any) => item.id.toString() === id || item.key === id);
        if (cmsItem) {
          setCmsItem(cmsItem);
          setFormData({
            title: cmsItem.title || '',
            content: cmsItem.content || '',
            key: cmsItem.key || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching CMS content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSContent();
    fetchLanguages();
  }, [id]);

  const handleUpdate = async () => {
    try {
      // Create translations array for selected languages
      const translations = [];
      
      // Auto-translate for all selected languages
      for (const langCode of selectedLanguagesForEdit) {
        try {
          if (langCode === 'en') {
            // Add English (base) translation
            translations.push({
              languageCode: 'en',
              title: formData.title,
              content: formData.content
            });
          } else {
            // Translate to other languages
            const translatedTitle = await translateText(formData.title, langCode);
            const translatedContent = await translateText(formData.content, langCode);
            
            translations.push({
              languageCode: langCode,
              title: translatedTitle,
              content: translatedContent
            });
          }
        } catch (error) {
          console.error(`Translation failed for ${langCode}:`, error);
          // Add fallback with original content
          translations.push({
            languageCode: langCode,
            title: formData.title,
            content: formData.content
          });
        }
      }
      
      await updateCMS(cmsItem!.id, {
        key: formData.key,
        translations: translations
      });
      
      setIsEditing(false);
      fetchCMSContent();
    } catch (error) {
      console.error('Error updating CMS item:', error);
    }
  };

  const handleTranslate = async () => {
    if (!formData.content || selectedLanguagesForEdit.length === 0) return;
    
    try {
      const targetLang = selectedLanguagesForEdit[0]; // Use first selected language
      const translated = await translateText(formData.content, targetLang);
      setFormData(prev => ({ ...prev, content: translated }));
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const handleSave = async () => {
    if (!cmsItem) return;
    
    try {
      await updateCMS(cmsItem.id, {
        ...cmsItem,
        content: formData.content,
        language: 'en'
      });
      setIsEditing(false);
      fetchCMSContent();
    } catch (error) {
      console.error('Error saving CMS content:', error);
    }
  };

  const handleDelete = async () => {
    if (!cmsItem) return;
    
    if (window.confirm('Are you sure you want to delete this CMS item?')) {
      try {
        await deleteCMS(cmsItem.id);
        navigate('/home/cms');
      } catch (error) {
        console.error('Error deleting CMS item:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
          Loading CMS content...
        </div>
      </div>
    );
  }

  if (!cmsItem) {
    return (
      <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
          CMS item not found.
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => navigate('/home/cms')}
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "#fff",
                color: "#374151",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiArrowLeft /> Back to CMS
            </button>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "5px" }}>
                {cmsItem.title}
              </h1>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                Key: {cmsItem.key} | Last updated: {formatDate(cmsItem.updatedAt)}
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiEdit /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "8px",
                background: "#dc2626",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "20px",
          marginBottom: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiGlobe style={{ fontSize: "18px", color: "#6b7280" }} />
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Languages (Select multiple for auto-translation):</span>
          </div>
          <div style={{ position: "relative", flex: 1 }}>
            <button
              type="button"
              onClick={() => setShowEditLanguageDropdown(!showEditLanguageDropdown)}
              style={{
                width: "100%",
                maxWidth: "300px",
                padding: "12px",
                border: selectedLanguagesForEdit.length > 0 ? "2px solid #2563eb" : "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                color: selectedLanguagesForEdit.length > 0 ? "#2563eb" : "#374151",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "left"
              }}
            >
              <span>
                {selectedLanguagesForEdit.length === 0 
                  ? "Select languages..." 
                  : `${selectedLanguagesForEdit.length} language(s) selected`
                }
              </span>
              <span style={{ fontSize: "12px" }}>▼</span>
            </button>
            
            {showEditLanguageDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                padding: "12px",
                marginTop: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto"
              }}>
                {availableLanguages.map((lang: any) => (
                  <div key={lang.code} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                    <input
                      type="checkbox"
                      id={`edit-lang-${lang.code}`}
                      checked={selectedLanguagesForEdit.includes(lang.code)}
                      onChange={() => {
                        setSelectedLanguagesForEdit(prev => {
                          if (prev.includes(lang.code)) {
                            return prev.filter(code => code !== lang.code);
                          } else {
                            return [...prev, lang.code];
                          }
                        });
                      }}
                      style={{ marginRight: "8px" }}
                    />
                    <label htmlFor={`edit-lang-${lang.code}`} style={{ 
                      fontSize: "14px", 
                      cursor: "pointer",
                      color: selectedLanguagesForEdit.includes(lang.code) ? "#2563eb" : "#374151"
                    }}>
                      {lang.name}
                    </label>
                  </div>
                ))}
                <div style={{ 
                  marginTop: "8px", 
                  paddingTop: "8px", 
                  borderTop: "1px solid #e5e7eb",
                  fontSize: "12px", 
                  color: "#6b7280" 
                }}>
                  {selectedLanguagesForEdit.length} language(s) selected
                </div>
              </div>
            )}
          </div>
          {isEditing && (
            <button
              onClick={handleTranslate}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                background: "#10b981",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Auto Translate
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
          {isEditing ? (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontSize: "16px", fontWeight: "500", color: "#374151" }}>
                  Content Editor
                </label>
                <div data-color-mode="light">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                    height={400}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    border: "1.5px solid #C0C0C0",
                    borderRadius: "8px",
                    background: "#fff",
                    fontSize: "16px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "16px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: "#1e293b" }}>
                Content Preview
              </h2>
              <div style={{
                fontSize: "16px", 
                lineHeight: "1.6", 
                color: "#374151",
                minHeight: "200px",
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}
              dangerouslySetInnerHTML={{ __html: formData.content || 'No content available' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CMSDetailPage;
