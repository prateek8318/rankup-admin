import React from 'react';

export interface MasterModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  width?: string | number;
  maxWidth?: string;
}

const MasterModal: React.FC<MasterModalProps> = ({
  isOpen,
  title,
  children,
  width = "500px",
  maxWidth = "90%"
}) => {
  if (!isOpen) return null;

  return (
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
        width,
        maxWidth,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: "600" }}>
          {title}
        </h3>
        
        {children}
      </div>
    </div>
  );
};

export default MasterModal;

