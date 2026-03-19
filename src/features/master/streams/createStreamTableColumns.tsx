import StatusBadge from '@/components/common/StatusBadge';
import type { TableColumn } from '@/components/common/MasterTable';
import { LanguageDto, StreamDto, StreamName } from '@/types/qualification';
import styles from '@/pages/master/Streams.module.css';
import { getLanguageDisplayName, getStreamDescription } from './streamUtils';

export const createStreamTableColumns = (languages: LanguageDto[]): TableColumn[] => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  {
    key: 'description',
    label: 'Description',
    render: (stream: StreamDto) => getStreamDescription(stream),
  },
  { key: 'qualificationName', label: 'Qualification' },
  {
    key: 'languages',
    label: 'Languages',
    render: (stream: StreamDto) => (
      <div className={styles.languageContainer}>
        {stream.names.map((name: StreamName) => (
          <span key={name.languageId} className={styles.languageBadge}>
            {getLanguageDisplayName(languages, name.languageId)}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (stream: StreamDto) => <StatusBadge isActive={stream.isActive} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (stream: StreamDto) => new Date(stream.createdAt).toLocaleDateString(),
  },
  { key: 'actions', label: 'Actions' },
];
