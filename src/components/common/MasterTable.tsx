import React from 'react';
import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

export interface TableColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

export interface MasterTableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  emptyMessage?: string;
  loadingMessage?: string;
}

const MasterTable: React.FC<MasterTableProps> = ({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  emptyMessage = "No data found.",
  loadingMessage = "Loading..."
}) => {
  const renderActions = (item: any, key?: string) => (
    <td key={key} style={{ padding: 12 }}>
      <button
        onClick={() => onEdit?.(item)}
        style={{
          background: 'none',
          border: 'none',
          marginRight: 8,
          padding: '4px',
          cursor: 'pointer'
        }}
        title="Edit"
      >
        <img src={editIcon} alt="Edit" style={{ width: 16, height: 16 }} />
      </button>
      {item.isActive && onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer'
          }}
          title="Delete"
        >
          <img src={deleteIcon} alt="Delete" style={{ width: 16, height: 16 }} />
        </button>
      )}
    </td>
  );

  if (loading) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#6b7280' }}>
          {loadingMessage}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
      {data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          {emptyMessage}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1e40af', color: '#fff' }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: 12,
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1.5px solid #C0C0C0',
                  backgroundColor: row.isActive ? 'transparent' : '#f3f4f6',
                  opacity: row.isActive ? 1 : 0.6
                }}
              >
                {columns.map((column) => {
                  if (column.key === 'actions') {
                    return renderActions(row, column.key);
                  }
                  
                  return (
                    <td key={column.key} style={{ padding: 12, fontSize: '14px' }}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MasterTable;

