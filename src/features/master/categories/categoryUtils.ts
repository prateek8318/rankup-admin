import { CategoryDto } from '@/services/masterApi';
import { CategoryLanguage } from './hooks/useCategories';

export const getCategoryDisplayName = (
  category: CategoryDto,
  selectedLanguage: CategoryLanguage,
) => (selectedLanguage === 'hi' && category.nameHi ? category.nameHi : category.nameEn);

export const filterCategories = (
  categories: CategoryDto[],
  searchTerm: string,
  selectedLanguage: CategoryLanguage,
) => {
  const normalizedSearch = searchTerm.toLowerCase();

  return categories.filter((category) => (
    getCategoryDisplayName(category, selectedLanguage).toLowerCase().includes(normalizedSearch)
    || category.key.toLowerCase().includes(normalizedSearch)
    || category.type.toLowerCase().includes(normalizedSearch)
  ));
};
