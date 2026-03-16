import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#b91c1c", marginBottom: 8 }}>Access denied</h2>
      <p style={{ marginBottom: 16 }}>
        You do not have permission to view this page.
      </p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          borderRadius: 6,
          border: "none",
          background:
            "linear-gradient(90deg, #2B5DBC 0%, #073081 100%)",
          color: "#fff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Go back
      </button>
    </div>
  );
};

export default UnauthorizedPage;

