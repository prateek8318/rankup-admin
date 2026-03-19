import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
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
      notificationService.error('Failed to fetch languages');
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
      const response = await languageApi.delete(languageId);
      
      // Check if the response indicates success
      if (response.status === 200 || response.status === 204) {
        // Immediately update local state to remove the deleted item
        setLanguages(prev => prev.filter(lang => lang.id !== languageId));
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete language' };
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      // Check if it's actually a success but with unexpected response format
      if (error.response?.status === 200 || error.response?.status === 204) {
        setLanguages(prev => prev.filter(lang => lang.id !== languageId));
        return { success: true };
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete language';
        return { success: false, error: errorMessage };
      }
    }
  };

  const toggleLanguageStatus = async (language: LanguageDto) => {
    try {
      await languageApi.update(language.id, { isActive: !language.isActive });
      notificationService.success(`Language ${language.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchLanguages();
    } catch (error) {
      notificationService.error('Failed to update language status');
    }
  };

  const saveLanguage = async (formData: CreateLanguageDto | UpdateLanguageDto, editingLanguage: LanguageDto | null) => {
    try {
      if (editingLanguage) {
        await languageApi.update(editingLanguage.id, formData as UpdateLanguageDto);
        notificationService.success('Language updated successfully');
      } else {
        await languageApi.create(formData as CreateLanguageDto);
        notificationService.success('Language created successfully');
      }
      fetchLanguages();
      return true;
    } catch (error) {
      notificationService.error('Failed to save language');
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
