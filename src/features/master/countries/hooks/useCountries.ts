import { useCallback, useEffect, useState } from 'react';
import {
  countryApi,
  CountryDto,
  CreateCountryDto,
  LanguageDto,
  UpdateCountryDto,
  languageApi,
} from '@/services/masterApi';
import { errorHandlingService } from '@/services/errorHandlingService';
import { notificationService } from '@/services/notificationService';
import { extractApiData } from '@/utils/apiHelpers';

export type CountryLanguage = 'en' | 'hi';

export const useCountries = (selectedLanguage: CountryLanguage) => {
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await countryApi.getAll(selectedLanguage);
      setCountries(extractApiData<CountryDto>(response));
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchCountries');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage]);

  const fetchLanguages = useCallback(async () => {
    try {
      const response = await languageApi.getAll();
      setLanguages(extractApiData<LanguageDto>(response));
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchLanguages');
      setLanguages([]);
    }
  }, []);

  useEffect(() => {
    void fetchCountries();
    void fetchLanguages();
  }, [fetchCountries, fetchLanguages]);

  const deleteCountry = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this country?')) {
      return;
    }

    try {
      await countryApi.updateStatus(id, false);
      await fetchCountries();
      notificationService.success('Country deactivated successfully');
    } catch (error) {
      errorHandlingService.handleError(error, 'deactivateCountry');
    }
  };

  const saveCountry = async (
    formData: CreateCountryDto,
    editingCountry: CountryDto | null,
  ) => {
    try {
      if (editingCountry) {
        const updateData: UpdateCountryDto = {
          id: editingCountry.id,
          nameEn: formData.nameEn || formData.name || '',
          nameHi: formData.nameHi || '',
          code: formData.code || '',
          subdivisionLabelEn: formData.subdivisionLabelEn || 'State',
          subdivisionLabelHi: formData.subdivisionLabelHi || 'राज्य',
          isActive: formData.isActive !== undefined ? formData.isActive : true,
        };

        await countryApi.update(editingCountry.id, updateData);
      } else {
        await countryApi.create(formData);
      }

      await fetchCountries();
      notificationService.success(editingCountry ? 'Country updated successfully' : 'Country created successfully');
      return true;
    } catch (error) {
      errorHandlingService.handleError(error, 'saveCountry');
      return false;
    }
  };

  return {
    countries,
    languages,
    loading,
    deleteCountry,
    saveCountry,
  };
};
