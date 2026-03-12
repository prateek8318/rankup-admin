import React from 'react';

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface MasterHeaderProps {
  title?: string;
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  addButtonLabel: string;
  onAddClick: () => void;
  filters?: Array<{
    key: string;
    label: string;
    value: string | number | null;
    options: FilterOption[];
    onChange: (value: string | number | null) => void;
  }>;
}

const MasterHeader: React.FC<MasterHeaderProps> = ({
  title,
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  addButtonLabel,
  onAddClick,
  filters = []
}) => {
  return (
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
        {title && (
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            {title}
          </h2>
        )}
        
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value ?? ''}
            onChange={(e) => filter.onChange(e.target.value ? (isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)) : null)}
            style={{
              padding: "10px 15px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">{`All ${filter.label}s`}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      <button
        onClick={onAddClick}
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
        {addButtonLabel}
      </button>
    </div>
  );
};

export default MasterHeader;

