import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { languageApi, LanguageDto, CreateLanguageDto, UpdateLanguageDto } from '@/services/masterApi';

export const useLanguages = (selectedStatusFilter?: string) => {
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await languageApi.getAll();
      let data = response.data?.data || response.data || [];
      if (!Array.isArray(data)) data = [];
      setLanguages(data);
    } catch (error) {
      toast.error('Failed to fetch languages');
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages, selectedStatusFilter]);

  const deleteLanguage = async (languageId: number) => {
    try {
      await languageApi.delete(languageId);
      toast.success('Language deleted successfully');
      fetchLanguages();
    } catch (error) {
      toast.error('Failed to delete language');
    }
  };

  const toggleLanguageStatus = async (language: LanguageDto) => {
    try {
      await languageApi.update(language.id, { isActive: !language.isActive });
      toast.success(`Language ${language.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchLanguages();
    } catch (error) {
      toast.error('Failed to update language status');
    }
  };

  const saveLanguage = async (formData: CreateLanguageDto | UpdateLanguageDto, editingLanguage: LanguageDto | null) => {
    try {
      if (editingLanguage) {
        await languageApi.update(editingLanguage.id, formData as UpdateLanguageDto);
        toast.success('Language updated successfully');
      } else {
        await languageApi.create(formData as CreateLanguageDto);
        toast.success('Language created successfully');
      }
      fetchLanguages();
      return true;
    } catch (error) {
      toast.error('Failed to save language');
      return false;
    }
  };

  return {
    languages,
    loading,
    deleteLanguage,
    toggleLanguageStatus,
    saveLanguage,
  };
};
