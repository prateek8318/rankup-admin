import { useState, useEffect } from 'react';
import { languageApi, LanguageDto, CreateLanguageDto, UpdateLanguageDto } from '@/core/api/masterApi';

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      try {
        await languageApi.delete(id);
        fetchLanguages();
      } catch (error) {
        console.error('Error deleting language:', error);
      }
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await languageApi.updateStatus(id, isActive);
      fetchLanguages();
    } catch (error) {
      console.error('Error updating language status:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', isActive: true });
    setEditingLanguage(null);
    setShowModal(false);
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
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
                          fontSize: "14px",
                          marginRight: "8px"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(language.id, !language.isActive)}
                        style={{
                          background: "none",
                          border: "none",
                          color: language.isActive ? "#f59e0b" : "#10b981",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginRight: "8px"
                        }}
                      >
                        {language.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(language.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        Delete
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
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
