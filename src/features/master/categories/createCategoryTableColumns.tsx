import type { TableColumn } from '@/components/common/MasterTable';
import StatusBadge from '@/components/common/StatusBadge';
import { CategoryDto } from '@/services/masterApi';
import { CategoryLanguage } from './hooks/useCategories';
import { getCategoryDisplayName } from './categoryUtils';

export const createCategoryTableColumns = (
  selectedLanguage: CategoryLanguage,
): TableColumn[] => [
  { key: 'id', label: 'ID' },
  {
    key: 'name',
    label: 'Name',
    render: (category: CategoryDto) => (
      <div>
        <div>{getCategoryDisplayName(category, selectedLanguage)}</div>
        {selectedLanguage === 'en' && category.nameHi && (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{category.nameHi}</div>
        )}
        {selectedLanguage === 'hi' && (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{category.nameEn}</div>
        )}
      </div>
    ),
  },
  { key: 'key', label: 'Key' },
  {
    key: 'type',
    label: 'Type',
    render: (category: CategoryDto) => (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: 12,
          fontSize: '12px',
          fontWeight: '500',
          background: '#f3f4f6',
          color: '#374151',
        }}
      >
        {category.type}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (category: CategoryDto) => <StatusBadge isActive={category.isActive} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (category: CategoryDto) => new Date(category.createdAt).toLocaleDateString(),
  },
  { key: 'actions', label: 'Actions' },
];
