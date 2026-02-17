import { useState, useEffect } from 'react';
import { stateApi, StateDto, CreateStateDto, UpdateStateDto } from '@/core/api/masterApi';

const States = () => {
  const [states, setStates] = useState<StateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingState, setEditingState] = useState<StateDto | null>(null);
  const [formData, setFormData] = useState<CreateStateDto>({
    name: '',
    countryCode: '',
    languageId: undefined,
    isActive: true
  });

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await stateApi.getAll();
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

  useEffect(() => {
    fetchStates();
  }, []);

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
      countryCode: state.countryCode,
      languageId: state.languageId,
      isActive: state.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        await stateApi.delete(id);
        fetchStates();
      } catch (error) {
        console.error('Error deleting state:', error);
      }
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await stateApi.updateStatus(id, isActive);
      fetchStates();
    } catch (error) {
      console.error('Error updating state status:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', countryCode: '', languageId: undefined, isActive: true });
    setEditingState(null);
    setShowModal(false);
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
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
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={async () => {
              try {
                await stateApi.seedLanguages();
                alert('State languages seeded successfully!');
                fetchStates();
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
                  fetchStates();
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
          </button>
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
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Country Code</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Language ID</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Created</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#fff", fontSize: "14px", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStates.map((state) => (
                  <tr key={state.id} style={{ borderBottom: "1.5px solid #C0C0C0" }}>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{state.id}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{state.name}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{state.countryCode}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{state.languageId || '-'}</td>
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
                          fontSize: "14px",
                          marginRight: "8px"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(state.id, !state.isActive)}
                        style={{
                          background: "none",
                          border: "none",
                          color: state.isActive ? "#f59e0b" : "#10b981",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginRight: "8px"
                        }}
                      >
                        {state.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(state.id)}
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
              {editingState ? "Edit State" : "Add State"}
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
                  Country Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
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
                  Language ID
                </label>
                <input
                  type="number"
                  value={formData.languageId || ''}
                  onChange={(e) => setFormData({ ...formData, languageId: e.target.value ? parseInt(e.target.value) : undefined })}
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
