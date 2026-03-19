import { LanguageDto, StreamName } from '@/types/qualification';
import styles from '@/pages/master/Streams.module.css';

interface StreamTranslationFieldsProps {
  languages: LanguageDto[];
  names: StreamName[];
  onTranslationChange: (
    languageId: number,
    field: 'name' | 'description',
    value: string,
  ) => void;
}

const StreamTranslationFields = ({
  languages,
  names,
  onTranslationChange,
}: StreamTranslationFieldsProps) => {
  if (names.length === 0) {
    return null;
  }

  return (
    <div className={styles.translationSection}>
      <label className={styles.translationLabel}>
        Stream Names and Descriptions by Language *
      </label>
      <div className={styles.translationList}>
        {names.map((name) => {
          const language = languages.find((item) => item.id === name.languageId);

          return (
            <div key={name.languageId} className={styles.translationItem}>
              <div className={styles.translationLangName}>
                {language?.name} ({language?.nativeName})
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Name:</label>
                <input
                  type="text"
                  required
                  value={name.name}
                  onChange={(event) => onTranslationChange(name.languageId, 'name', event.target.value)}
                  className={styles.inputField}
                />
              </div>
              <div>
                <label className={styles.inputLabel}>Description:</label>
                <textarea
                  required
                  value={name.description}
                  onChange={(event) => onTranslationChange(
                    name.languageId,
                    'description',
                    event.target.value,
                  )}
                  rows={2}
                  className={styles.textareaField}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreamTranslationFields;
