import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCMSList, updateCMS, deleteCMS } from '@/core/api/dashboardApi';
import { FiEdit, FiTrash2, FiArrowLeft, FiGlobe } from 'react-icons/fi';
import MDEditor from '@uiw/react-md-editor';

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
    content: '',
    language: 'en'
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translatedContent, setTranslatedContent] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' }
  ];

  const fetchCMSContent = async () => {
    try {
      setLoading(true);
      // Try to get content by ID first, then by key if needed
      const response = await getCMSList({ page: 1, limit: 10, search: id, language: selectedLanguage });
      if (response.success && response.data && response.data.length > 0) {
        const cmsItem = response.data.find((item: any) => item.id.toString() === id || item.key === id);
        if (cmsItem) {
          setCmsItem(cmsItem);
          setFormData({
            content: cmsItem.content || '',
            language: cmsItem.language || 'en'
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
    if (id) {
      fetchCMSContent();
    }
  }, [id, selectedLanguage]);

  const handleTranslate = async () => {
    if (!formData.content) return;
    
    // Simple translation simulation - in real app, you'd call a translation API
    const translations: { [key: string]: string } = {
      'hi': 'यह एक नमूना अनुवाद है। ' + formData.content,
      'gu': 'આ એક નમૂનો અનુવાદ છે. ' + formData.content
    };
    
    setTranslatedContent(translations[selectedLanguage] || formData.content);
  };

  const handleSave = async () => {
    if (!cmsItem) return;
    
    try {
      await updateCMS(cmsItem.id, {
        ...cmsItem,
        content: translatedContent || formData.content,
        language: selectedLanguage
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
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Language:</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                style={{
                  padding: "6px 12px",
                  border: selectedLanguage === lang.code ? "2px solid #2563eb" : "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: selectedLanguage === lang.code ? "#eff6ff" : "#fff",
                  color: selectedLanguage === lang.code ? "#2563eb" : "#374151",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                {lang.name}
              </button>
            ))}
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
                fontSize: "14px",
                marginLeft: "auto"
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
                    value={translatedContent || formData.content}
                    onChange={(value) => setTranslatedContent(value || '')}
                    height={400}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setIsEditing(false);
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
                  onClick={handleSave}
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
                  Save Changes
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
