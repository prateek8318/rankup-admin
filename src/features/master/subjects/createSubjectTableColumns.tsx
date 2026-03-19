import type { TableColumn } from '@/components/common/MasterTable';
import StatusBadge from '@/components/common/StatusBadge';
import { LanguageDto, SubjectDto } from '@/services/masterApi';
import { getSubjectLanguageName, truncateDescription } from './subjectUtils';

export const createSubjectTableColumns = (
  languages: LanguageDto[],
): TableColumn[] => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  {
    key: 'description',
    label: 'Description',
    render: (subject: SubjectDto) => truncateDescription(subject.description),
  },
  {
    key: 'languages',
    label: 'Languages',
    render: (subject: SubjectDto) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {(subject.names || []).map((name) => (
          <span
            key={name.languageId}
            style={{
              padding: '2px 6px',
              background: '#dbeafe',
              color: '#1e40af',
              borderRadius: 8,
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {getSubjectLanguageName(languages, name.languageId)}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (subject: SubjectDto) => <StatusBadge isActive={subject.isActive} />,
  },
  { key: 'actions', label: 'Actions' },
];
