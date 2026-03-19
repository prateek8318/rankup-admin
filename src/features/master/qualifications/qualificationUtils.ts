import { LanguageDto, QualificationDto, QualificationName } from '@/types/qualification';

export const createInitialQualificationFormData = () => ({
  name: '',
  description: '',
  countryCode: '',
  names: [] as QualificationName[],
});

export const filterQualifications = (
  qualifications: QualificationDto[],
  searchTerm: string,
) => {
  const normalizedSearch = searchTerm.toLowerCase();

  return qualifications.filter((qualification) => (
    qualification.name.toLowerCase().includes(normalizedSearch)
    || qualification.description.toLowerCase().includes(normalizedSearch)
  ));
};

export const getQualificationLanguageName = (
  languages: LanguageDto[],
  languageId: number,
  fallback?: string,
) => languages.find((language) => language.id === languageId)?.name || fallback || `Lang ${languageId}`;

export const updateQualificationTranslation = (
  names: QualificationName[],
  languageId: number,
  updates: Partial<QualificationName>,
) => names.map((name) => (
  name.languageId === languageId ? { ...name, ...updates } : name
));
