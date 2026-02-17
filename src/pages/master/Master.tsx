import React from 'react';
import { Outlet } from 'react-router-dom';

const Master = () => {
  return (
    <div
      style={{
        background: "#E6F5FF",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "30px 60px",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Master Management</h2>
              <p style={{ color: "#000", margin: 0, paddingTop: 20, fontSize: 18 }}>
                Manage languages, states, countries, and categories
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <Outlet />
      </div>
    </div>
  );
};

export default Master;
