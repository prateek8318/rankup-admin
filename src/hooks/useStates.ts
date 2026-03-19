import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import {
  stateApi, countryApi, languageApi,
  StateDto, CountryDto, LanguageDto, CreateStateDto, UpdateStateDto
} from '@/services/masterApi';
import { extractApiData } from '@/utils/apiHelpers';

export const useStates = (selectedLanguageId?: number, selectedCountryCode?: string) => {
  const [states, setStates] = useState<StateDto[]>([]);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await stateApi.getAll(selectedLanguageId, selectedCountryCode || undefined);
      setStates(extractApiData<StateDto>(response));
    } catch (error) {
      notificationService.error('Failed to fetch states');
      setStates([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguageId, selectedCountryCode]);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await countryApi.getAll();
      setCountries(extractApiData<CountryDto>(response));
    } catch (error) {
      setCountries([]);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      const response = await languageApi.getAll();
      setLanguages(extractApiData<LanguageDto>(response));
    } catch (error) {
      setLanguages([]);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchStates(), fetchCountries(), fetchLanguages()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchStates, fetchCountries, fetchLanguages]);

  const deleteState = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this state?')) {
      try {
        await stateApi.updateStatus(id, false);
        notificationService.success('State deactivated successfully');
        fetchStates();
      } catch (error) {
        notificationService.error('Error deactivating state');
      }
    }
  };

  const saveState = async (formData: CreateStateDto | UpdateStateDto, editingState: StateDto | null) => {
    try {
      if (editingState) {
        await stateApi.update(editingState.id, formData as UpdateStateDto);
        notificationService.success('State updated successfully');
      } else {
        await stateApi.create(formData as CreateStateDto);
        notificationService.success('State created successfully');
      }
      fetchStates();
      return true;
    } catch (error) {
      notificationService.error('Error saving state');
      return false;
    }
  };

  return {
    states,
    countries,
    languages,
    loading,
    deleteState,
    saveState,
  };
};
