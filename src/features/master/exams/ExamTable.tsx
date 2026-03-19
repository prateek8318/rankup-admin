import editIcon from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import Loader from '@/components/common/Loader';
import { ExamDto } from '@/services/examsApi';
import { LanguageDto } from '@/types/qualification';
import styles from '@/pages/master/Exams.module.css';
import { getExamImageSource } from './examUtils';

interface ExamTableProps {
  exams: ExamDto[];
  languages: LanguageDto[];
  loading: boolean;
  onEdit: (exam: ExamDto) => void;
  onDelete: (id: number) => void;
}

const ExamTable = ({
  exams,
  languages,
  loading,
  onEdit,
  onDelete,
}: ExamTableProps) => (
  <div className={styles.tableContainer}>
    {loading ? (
      <Loader fullPage={false} message="Loading exams..." />
    ) : (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Country</th>
            <th className={styles.th}>Age</th>
            <th className={styles.th}>Languages</th>
            <th className={styles.th}>Image</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className={exam.isActive ? styles.trActive : styles.trInactive}>
              <td className={styles.td}>{exam.id}</td>
              <td className={styles.td}>{exam.name}</td>
              <td className={styles.td}>{exam.countryCode}</td>
              <td className={styles.td}>{exam.minAge}-{exam.maxAge}</td>
              <td className={styles.td}>
                {(exam.names || [])
                  .map((name) => languages.find((language) => language.id === name.languageId)?.name || name.languageId)
                  .join(', ')}
              </td>
              <td className={styles.td}>
                {getExamImageSource(exam) && (
                  <img
                    src={getExamImageSource(exam)}
                    alt="exam"
                    style={{ height: 32, marginRight: 8 }}
                  />
                )}
              </td>
              <td className={styles.td}>
                <span className={exam.isActive ? styles.statusActive : styles.statusInactive}>
                  {exam.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className={styles.td}>
                <button onClick={() => onEdit(exam)} className={styles.iconButton} title="Edit">
                  <img src={editIcon} alt="Edit" style={{ width: 16 }} />
                </button>
                {exam.isActive && (
                  <button onClick={() => onDelete(exam.id)} className={styles.iconButton} title="Delete">
                    <img src={deleteIcon} alt="Delete" style={{ width: 16 }} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ExamTable;
