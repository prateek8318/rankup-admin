import { LanguageDto } from '@/types/qualification';

interface TranslationItem {
  languageId: number;
  name: string;
  description?: string;
}

interface NameDescriptionTranslationFieldsProps<T extends TranslationItem> {
  label: string;
  languages: LanguageDto[];
  items: T[];
  classNames: {
    section: string;
    label: string;
    list: string;
    item: string;
    languageName: string;
    inputGroup: string;
    inputLabel: string;
    inputField: string;
    textareaField: string;
  };
  onChange: (
    languageId: number,
    field: 'name' | 'description',
    value: string,
  ) => void;
}

const NameDescriptionTranslationFields = <T extends TranslationItem>({
  label,
  languages,
  items,
  classNames,
  onChange,
}: NameDescriptionTranslationFieldsProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={classNames.section}>
      <label className={classNames.label}>{label}</label>
      <div className={classNames.list}>
        {items.map((item) => {
          const language = languages.find((entry) => entry.id === item.languageId);

          return (
            <div key={item.languageId} className={classNames.item}>
              <div className={classNames.languageName}>
                {language?.name} ({language?.nativeName})
              </div>
              <div className={classNames.inputGroup}>
                <label className={classNames.inputLabel}>Name:</label>
                <input
                  type="text"
                  required
                  value={item.name}
                  onChange={(event) => onChange(item.languageId, 'name', event.target.value)}
                  className={classNames.inputField}
                />
              </div>
              <div>
                <label className={classNames.inputLabel}>Description:</label>
                <textarea
                  required
                  value={item.description || ''}
                  onChange={(event) => onChange(item.languageId, 'description', event.target.value)}
                  rows={2}
                  className={classNames.textareaField}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NameDescriptionTranslationFields;
