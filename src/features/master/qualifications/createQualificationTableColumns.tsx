import type { TableColumn } from '@/components/common/MasterTable';
import StatusBadge from '@/components/common/StatusBadge';
import { LanguageDto, QualificationDto, QualificationName } from '@/types/qualification';
import styles from '@/pages/master/Qualifications.module.css';
import { getQualificationLanguageName } from './qualificationUtils';

export const createQualificationTableColumns = (
  languages: LanguageDto[],
): TableColumn[] => [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'countryCode', label: 'Country' },
  {
    key: 'languages',
    label: 'Languages',
    render: (qualification: QualificationDto) => (
      <div className={styles.languageContainer}>
        {qualification.names.map((name: QualificationName) => (
          <span key={name.languageId} className={styles.languageBadge}>
            {getQualificationLanguageName(languages, name.languageId, name.languageCode)}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (qualification: QualificationDto) => <StatusBadge isActive={qualification.isActive} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    render: (qualification: QualificationDto) => new Date(qualification.createdAt).toLocaleDateString(),
  },
  { key: 'actions', label: 'Actions' },
];
