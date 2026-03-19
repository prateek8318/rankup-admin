import { CountryDto } from '@/services/masterApi';
import { CountryLanguage } from './hooks/useCountries';

export const getCountryDisplayName = (
  country: CountryDto,
  selectedLanguage: CountryLanguage,
) => {
  if (selectedLanguage === 'hi') {
    return country.nameHi || country.nameEn || country.name;
  }

  return country.nameEn || country.name;
};

export const filterCountries = (
  countries: CountryDto[],
  searchTerm: string,
  selectedLanguage: CountryLanguage,
) => {
  const normalizedSearch = searchTerm.toLowerCase();

  return countries.filter((country) => (
    getCountryDisplayName(country, selectedLanguage).toLowerCase().includes(normalizedSearch)
    || country.code.toLowerCase().includes(normalizedSearch)
  ));
};
