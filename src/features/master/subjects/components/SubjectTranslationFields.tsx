import { LanguageDto, SubjectNameDto } from '@/services/masterApi';

interface SubjectTranslationFieldsProps {
  languages: LanguageDto[];
  names: SubjectNameDto[];
  onLanguageChange: (index: number, languageId: number) => void;
  onNameChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
}

const SubjectTranslationFields = ({
  languages,
  names,
  onLanguageChange,
  onNameChange,
  onDescriptionChange,
}: SubjectTranslationFieldsProps) => {
  if (!names.length) {
    return null;
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <strong>Translations</strong>
      </div>
      {names.map((translation, index) => (
        <div
          key={`${translation.languageId}-${index}`}
          style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}
        >
          <select
            value={translation.languageId}
            onChange={(event) => onLanguageChange(index, Number(event.target.value))}
            style={{ marginBottom: 8, padding: 6, borderRadius: 6 }}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <input
            value={translation.name}
            onChange={(event) => onNameChange(index, event.target.value)}
            placeholder="Translated name"
            style={{
              display: 'block',
              width: '100%',
              marginBottom: 8,
              padding: 8,
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
          <textarea
            value={translation.description || ''}
            onChange={(event) => onDescriptionChange(index, event.target.value)}
            placeholder="Translated description"
            rows={2}
            style={{ width: '100%', padding: 8, borderRadius: 6, boxSizing: 'border-box' }}
          />
        </div>
      ))}
    </div>
  );
};

export default SubjectTranslationFields;
