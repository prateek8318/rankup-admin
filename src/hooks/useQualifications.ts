import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { qualificationApi, mockCountries } from '@/services/qualificationApi';
import { languageApi } from '@/services/masterApi';
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
      const data = await qualificationApi.getAllQualifications(params);
      setQualifications(data);
    } catch (error) {
      toast.error('Failed to fetch qualifications');
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
    if (window.confirm('Are you sure you want to deactivate this qualification?')) {
      try {
        await qualificationApi.toggleQualificationStatus(id.toString(), false);
        toast.success('Qualification deactivated successfully');
        fetchQualifications();
      } catch (error) {
        toast.error('Failed to deactivate qualification');
      }
    }
  };

  const saveQualification = async (formData: CreateQualificationDto, editingQualification: QualificationDto | null) => {
    try {
      if (editingQualification) {
        await qualificationApi.updateQualification(editingQualification.id.toString(), {
          ...formData, id: editingQualification.id,
        });
        toast.success('Qualification updated successfully');
      } else {
        await qualificationApi.createQualification(formData);
        toast.success('Qualification created successfully');
      }
      fetchQualifications();
      return true;
    } catch (error) {
      toast.error('Failed to save qualification');
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
