import { LanguageDto } from '@/types/qualification';

interface TranslationItem {
  languageId: number;
  name: string;
}

interface NameTranslationFieldsProps<T extends TranslationItem> {
  label: string;
  languages: LanguageDto[];
  items: T[];
  classNames: {
    section: string;
    label: string;
    item: string;
    languageName: string;
    inputField: string;
  };
  onChange: (languageId: number, value: string) => void;
}

const NameTranslationFields = <T extends TranslationItem>({
  label,
  languages,
  items,
  classNames,
  onChange,
}: NameTranslationFieldsProps<T>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={classNames.section}>
      <label className={classNames.label}>{label}</label>
      {items.map((item) => {
        const language = languages.find((entry) => entry.id === item.languageId);

        return (
          <div key={item.languageId} className={classNames.item}>
            <label className={classNames.languageName}>
              {language?.name || `Language ${item.languageId}`}
            </label>
            <input
              type="text"
              required
              value={item.name}
              onChange={(event) => onChange(item.languageId, event.target.value)}
              placeholder={`Enter name in ${language?.name || 'this language'}`}
              className={classNames.inputField}
            />
          </div>
        );
      })}
    </div>
  );
};

export default NameTranslationFields;
