import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
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
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
