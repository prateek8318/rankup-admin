import React from 'react';

interface ExportButtonProps {
    onExport: () => void;
    loading?: boolean;
    label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, loading = false, label = 'Export to Excel' }) => {
    return (
        <button
            onClick={onExport}
            disabled={loading}
            style={{
                padding: '8px 16px',
                backgroundColor: '#10B981', // Emerald 500
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1,
            }}
        >
            {loading ? 'Exporting...' : label}
        </button>
    );
};

export default ExportButton;
