import { CountryDto, LanguageDto, StateDto, StateNameDto } from '@/services/masterApi';

export const createInitialStateFormData = () => ({
  name: '',
  code: '',
  countryCode: '',
  names: [] as StateNameDto[],
  isActive: true,
});

export const getCountryName = (countries: CountryDto[], code: string) => {
  const country = countries.find((item) => item.code === code);
  return country ? `${country.name} (${code})` : code;
};

export const getLanguageNames = (languages: LanguageDto[], names: StateNameDto[]) => {
  if (!names || names.length === 0) {
    return '-';
  }

  return names
    .map((name) => {
      const language = languages.find((entry) => entry.id === name.languageId);
      return language ? `${language.name}: ${name.name}` : name.name;
    })
    .join(', ');
};

export const getStateDisplayName = (
  state: StateDto,
  selectedLanguageId?: number,
) => {
  if (selectedLanguageId) {
    const localizedName = state.names?.find((name) => name.languageId === selectedLanguageId);
    return localizedName ? localizedName.name : state.name;
  }

  return state.name;
};

export const filterStates = (
  states: StateDto[],
  searchTerm: string,
  selectedLanguageId?: number,
) => {
  const normalizedSearch = searchTerm.toLowerCase();

  return states.filter((state) => (
    getStateDisplayName(state, selectedLanguageId).toLowerCase().includes(normalizedSearch)
    || state.countryCode.toLowerCase().includes(normalizedSearch)
    || state.code.toLowerCase().includes(normalizedSearch)
  ));
};

export const updateStateTranslation = (
  names: StateNameDto[],
  languageId: number,
  value: string,
) => names.map((name) => (
  name.languageId === languageId ? { ...name, name: value } : name
));
