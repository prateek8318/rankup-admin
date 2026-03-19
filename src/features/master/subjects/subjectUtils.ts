import { LanguageDto, SubjectDto } from '@/services/masterApi';

export const createInitialSubjectFormData = () => ({
  name: '',
  description: '',
  names: [],
  isActive: true,
});

export const filterSubjects = (
  subjects: SubjectDto[],
  searchTerm: string,
  selectedLanguageIdFilter: number | null,
) => {
  const normalizedSearch = searchTerm.toLowerCase();

  return subjects.filter((subject) => {
    const matchesSearch = (subject.name?.toLowerCase() || '').includes(normalizedSearch)
      || (subject.description?.toLowerCase() || '').includes(normalizedSearch);
    const matchesLanguage = !selectedLanguageIdFilter
      || (subject.names || []).some((name) => name.languageId === selectedLanguageIdFilter);

    return matchesSearch && matchesLanguage;
  });
};

export const truncateDescription = (description?: string) => {
  if (!description) {
    return '-';
  }

  return description.length > 60 ? `${description.substring(0, 60)}...` : description;
};

export const getSubjectLanguageName = (
  languages: LanguageDto[],
  languageId: number,
  fallback?: string,
) => languages.find((language) => language.id === languageId)?.name || fallback || `Lang ${languageId}`;
