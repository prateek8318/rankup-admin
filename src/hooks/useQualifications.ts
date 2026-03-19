import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import { qualificationApi as oldQualificationApi, mockCountries } from '@/services/qualificationApi';
import { qualificationApi, languageApi } from '@/services/masterApi';
import { QualificationDto, CreateQualificationDto, LanguageDto, CountryDto } from '@/types/qualification';
import { extractApiData } from '@/utils/apiHelpers';

export const useQualifications = (selectedLanguageFilter?: string) => {
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [countries] = useState<CountryDto[]>(mockCountries);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const fetchQualifications = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedLanguageFilter) params.language = selectedLanguageFilter;
      const data = await oldQualificationApi.getAllQualifications(params);
      setQualifications(data);
    } catch (error) {
      notificationService.error('Failed to fetch qualifications');
    } finally {
      setLoading(false);
    }
  }, [selectedLanguageFilter]);

  const fetchLanguages = useCallback(async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      setLanguages(extractApiData<LanguageDto>(response));
    } catch (error) {
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQualifications();
    fetchLanguages();
  }, [fetchQualifications, fetchLanguages]);

  const deleteQualification = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this qualification?')) {
      try {
        await qualificationApi.delete(id);
        notificationService.success('Qualification deleted successfully');
        fetchQualifications();
      } catch (error) {
        notificationService.error('Failed to delete qualification');
      }
    }
  };

  const saveQualification = async (formData: CreateQualificationDto, editingQualification: QualificationDto | null) => {
    try {
      if (editingQualification) {
        await qualificationApi.update(editingQualification.id, {
          ...formData, id: editingQualification.id,
        });
        notificationService.success('Qualification updated successfully');
      } else {
        await qualificationApi.create(formData);
        notificationService.success('Qualification created successfully');
      }
      fetchQualifications();
      return true;
    } catch (error) {
      notificationService.error('Failed to save qualification');
      return false;
    }
  };

  return {
    qualifications,
    countries,
    languages,
    loading,
    languagesLoading,
    deleteQualification,
    saveQualification,
  };
};
