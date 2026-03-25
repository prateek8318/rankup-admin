import React from 'react';
import { CrossIcon } from './CrossIcon';

export interface MasterModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  width?: string | number;
  maxWidth?: string;
  onClose?: () => void;
  disableClose?: boolean;
}

const MasterModal: React.FC<MasterModalProps> = ({
  isOpen,
  title,
  children,
  width = "500px",
  maxWidth = "90%",
  onClose,
  disableClose = false,
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
    }}
    onClick={disableClose ? undefined : onClose}
    >
      <div style={{
        background: "#fff",
        borderRadius: 13,
        padding: "30px",
        width,
        maxWidth,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
            {title}
          </h3>
          {onClose && (
            <CrossIcon
              onClick={onClose}
              disabled={disableClose}
            />
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default MasterModal;

