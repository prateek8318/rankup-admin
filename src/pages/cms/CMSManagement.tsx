import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCMSList, createCMS, deleteCMS, updateCMSStatus } from '@/services/dashboardApi';
import { languageApi } from '@/services/masterApi';
import { FiPlus, FiFilter } from 'react-icons/fi';
import MDEditor from '@uiw/react-md-editor';
import viewIcon from '@/assets/icons/view.png';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

// Translation function using Google Translate API (free tier)
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    ;
    ;
    ;
    
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
    ;

    // Using Google Translate API (you might need to set up API key)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    ;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      ;
      throw new Error('Translation failed');
    }

    const data = await response.json();
    ;
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translatedText = data[0][0][0];
      ;
      return translatedText;
    } else {
      ;
      return text; // Return original text if translation fails
    }
  } catch (error) {
    ;
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

const CMSManagement = () => {
  const [cmsItems, setCmsItems] = useState<CMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content: '',
    language: 'en'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedLanguagesForModal, setSelectedLanguagesForModal] = useState<string[]>(['en']); // Multi-select for modal
  const [showModalLanguageDropdown, setShowModalLanguageDropdown] = useState(false); // Dropdown visibility
  const [translatedContent, setTranslatedContent] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([]);
  const [selectedLanguagesFilter, setSelectedLanguagesFilter] = useState<string[]>([]);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);
  const navigate = useNavigate();

  const fetchCMSItems = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      
      
      if (selectedLanguagesFilter.length === 1) {
        params.language = selectedLanguagesFilter[0];
      } else if (selectedLanguagesFilter.length > 1) {
        params.languages = selectedLanguagesFilter.join(',');
      }
      
      const response = await getCMSList(params);
      if (response.success) {
        setCmsItems(response.data || []);
        setTotalItems(response.total || 0);
      }
    } catch (error) {
      ;
    } finally {
      setLoading(false);
    }
  };

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
      ;
    }
  };

  useEffect(() => {
    fetchCMSItems();
    fetchLanguages();
  }, [currentPage, searchTerm, selectedLanguagesFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create translations array for selected languages
      const translations = [];
      
      // Auto-translate for all selected languages
      for (const langCode of selectedLanguagesForModal) {
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
          ;
          // Add fallback with original content
          translations.push({
            languageCode: langCode,
            title: formData.title,
            content: formData.content
          });
        }
      }
      
      await createCMS({
        key: formData.key,
        translations: translations
      });
      
      setIsModalOpen(false);
      setFormData({ key: '', title: '', content: '', language: 'en' });
      setTranslatedContent('');
      setSelectedLanguagesForModal(['en']); // Reset to English only
      fetchCMSItems();
    } catch (error) {
      ;
    }
  };

  const languages = availableLanguages.length > 0 ? availableLanguages : [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' }
  ];

  const handleTranslate = async () => {
    if (!formData.content) return;
    
    try {
      const translated = await translateText(formData.content, selectedLanguage);
      setTranslatedContent(translated);
    } catch (error) {
      ;
      // Fallback to original content if translation fails
      setTranslatedContent(formData.content);
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/home/cms/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this CMS item?')) {
      try {
        await deleteCMS(id);
        fetchCMSItems();
      } catch (error) {
        ;
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateCMSStatus(id, newStatus === 'Active');
      fetchCMSItems();
    } catch (error) {
      ;
    }
  };

  const handleLanguageFilterToggle = (languageCode: string) => {
    setSelectedLanguagesFilter(prev => {
      // Allow only single language selection for proper API behavior
      if (prev.includes(languageCode)) {
        return [];
      } else {
        return [languageCode];
      }
    });
    // Close filter dropdown after selection
    setShowLanguageFilter(false);
  };

  const clearLanguageFilter = () => {
    setSelectedLanguagesFilter([]);
  };

  const stripHtmlTags = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E6F5FF", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
            Content Management System
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.5" }}>
            Manage website content, privacy policy, terms and conditions
          </p>
        </div>

        {/* ACTION BAR */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "20px",
          marginBottom: 30,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search CMS content..."
              style={{
                padding: "8px 16px",
                border: "1.5px solid #C0C0C0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "16px",
                minWidth: "300px"
              }}
            />
            
            {/* Language Filter Button */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowLanguageFilter(!showLanguageFilter)}
                style={{
                  padding: "8px 16px",
                  border: selectedLanguagesFilter.length > 0 ? "2px solid #2563eb" : "1.5px solid #C0C0C0",
                  borderRadius: "8px",
                  background: selectedLanguagesFilter.length > 0 ? "#eff6ff" : "#fff",
                  color: selectedLanguagesFilter.length > 0 ? "#2563eb" : "#374151",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <FiFilter /> Language {selectedLanguagesFilter.length > 0 && `(${selectedLanguagesFilter.length} selected)`}
              </button>
              
              {showLanguageFilter && (
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
                  <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Select Languages (Multiple Selection):
                  </div>
                  {languages.map((lang) => (
                    <div key={lang.code} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                      <input
                        type="checkbox"
                        id={`lang-${lang.code}`}
                        checked={selectedLanguagesFilter.includes(lang.code)}
                        onChange={() => handleLanguageFilterToggle(lang.code)}
                        style={{ marginRight: "8px" }}
                      />
                      <label htmlFor={`lang-${lang.code}`} style={{ fontSize: "14px", cursor: "pointer" }}>
                        {lang.name}
                      </label>
                    </div>
                  ))}
                  {selectedLanguagesFilter.length > 0 && (
                    <button
                      onClick={clearLanguageFilter}
                      style={{
                        marginTop: "8px",
                        padding: "4px 8px",
                        border: "none",
                        borderRadius: "4px",
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: "8px 24px",
                border: "none",
                borderRadius: "20px",
                background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <FiPlus /> Add New Content
            </button>
          </div>
        </div>

        {/* CMS TABLE */}
        <div style={{
          background: "#fff",
          borderRadius: 13,
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
              Loading CMS content...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1e40af" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Title</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Content</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Language</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Created Date</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Updated Date</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cmsItems.map((item) => (
                    <tr 
                      key={item.id} 
                      style={{ borderBottom: "1.5px solid #C0C0C0", cursor: "pointer" }}
                      onClick={() => handleRowClick(item.id)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <td style={{ padding: "12px", fontSize: "14px" }}>{item.title}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>
                        <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {stripHtmlTags(item.content)}
                        </div>
                      </td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>
                        {(() => {
                          const lang = languages.find(l => l.code === item.language);
                          return lang ? lang.name : (item.language ? item.language.toUpperCase() : 'EN');
                        })()}
                      </td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{formatDate(item.createdAt)}</td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>{formatDate(item.updatedAt)}</td>
                      <td style={{ padding: "12px" }}>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(item.id, item.status);
                          }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background: item.status === 'Active' ? "#dcfce7" : "#fee2e2",
                            color: item.status === 'Active' ? "#166534" : "#991b1b",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {item.status}
                          <span style={{ fontSize: "10px" }}>▼</span>
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item.id);
                            }}
                            style={{
                              background: "transparent",
                              border: "1px solid #d1d5db",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            title="View"
                          >
                            <img src={viewIcon} alt="View" style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item.id);
                            }}
                            style={{
                              background: "transparent",
                              border: "1px solid #d1d5db",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            title="Edit"
                          >
                            <img src={editIcon} alt="Edit" style={{ width: "14px", height: "14px" }} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            style={{
                              background: "transparent",
                              border: "1px solid #d1d5db",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                            title="Delete"
                          >
                            <img src={deleteIcon} alt="Delete" style={{ width: "14px", height: "14px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {cmsItems.length === 0 && !loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
                  No CMS content found. Add your first content item.
                </div>
              )}
            </div>
          )}

          {/* PAGINATION */}
          {totalItems > 10 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #f3f4f6"
            }}>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} items
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: currentPage === 1 ? "#f9fafb" : "#fff",
                    color: currentPage === 1 ? "#d1d5db" : "#374151",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "14px"
                  }}
                >
                  &lt; Prev
                </button>
                
                {Array.from({ length: Math.ceil(totalItems / 10) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      background: currentPage === page ? "#2563eb" : "#fff",
                      color: currentPage === page ? "#fff" : "#374151",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalItems / 10), prev + 1))}
                  disabled={currentPage >= Math.ceil(totalItems / 10)}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: currentPage >= Math.ceil(totalItems / 10) ? "#f9fafb" : "#fff",
                    color: currentPage >= Math.ceil(totalItems / 10) ? "#d1d5db" : "#374151",
                    cursor: currentPage >= Math.ceil(totalItems / 10) ? "not-allowed" : "pointer",
                    fontSize: "14px"
                  }}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
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
              borderRadius: "13px",
              padding: "30px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
                Add New CMS Content
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Privacy Policy, Terms and Conditions"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1.5px solid #C0C0C0",
                      borderRadius: "8px",
                      fontSize: "16px"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                    Content Key
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="e.g., privacy_policy, terms_conditions"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1.5px solid #C0C0C0",
                      borderRadius: "8px",
                      fontSize: "16px"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                    Languages (Select multiple for auto-translation)
                  </label>
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setShowModalLanguageDropdown(!showModalLanguageDropdown)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: selectedLanguagesForModal.length > 0 ? "2px solid #2563eb" : "1.5px solid #C0C0C0",
                        borderRadius: "8px",
                        background: "#fff",
                        color: selectedLanguagesForModal.length > 0 ? "#2563eb" : "#374151",
                        fontSize: "16px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left"
                      }}
                    >
                      <span>
                        {selectedLanguagesForModal.length === 0 
                          ? "Select languages..." 
                          : `${selectedLanguagesForModal.length} language(s) selected`
                        }
                      </span>
                      <span style={{ fontSize: "12px" }}>▼</span>
                    </button>
                    
                    {showModalLanguageDropdown && (
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
                        {languages.map((lang) => (
                          <div key={lang.code} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                            <input
                              type="checkbox"
                              id={`modal-lang-${lang.code}`}
                              checked={selectedLanguagesForModal.includes(lang.code)}
                              onChange={() => {
                                setSelectedLanguagesForModal(prev => {
                                  if (prev.includes(lang.code)) {
                                    return prev.filter(code => code !== lang.code);
                                  } else {
                                    return [...prev, lang.code];
                                  }
                                });
                              }}
                              style={{ marginRight: "8px" }}
                            />
                            <label htmlFor={`modal-lang-${lang.code}`} style={{ 
                              fontSize: "14px", 
                              cursor: "pointer",
                              color: selectedLanguagesForModal.includes(lang.code) ? "#2563eb" : "#374151"
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
                          {selectedLanguagesForModal.length} language(s) selected
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                    Content
                  </label>
                  <div data-color-mode="light">
                    <MDEditor
                      value={translatedContent || formData.content}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, content: value || '' }));
                        setTranslatedContent(value || '');
                      }}
                      height={300}
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ key: '', title: '', content: '', language: 'en' });
                      setTranslatedContent('');
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
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      background: "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
                      color: "#fff",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSManagement;

