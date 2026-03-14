import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCMSList, updateCMS, deleteCMS } from '@/services/dashboardApi';
import { languageApi } from '@/services/masterApi';
import { translateText } from '@/utils/translation';
import { notificationService } from '@/services/notificationService';

export interface CMSItem {
  id: string;
  key: string;
  title: string;
  content: string;
  language: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const useCMSDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cmsItem, setCmsItem] = useState<CMSItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    key: ''
  });
  const [selectedLanguagesForEdit, setSelectedLanguagesForEdit] = useState<string[]>(['en']);
  const [showEditLanguageDropdown, setShowEditLanguageDropdown] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([]);

  const fetchLanguages = async () => {
    try {
      const response = await languageApi.getAll();
      if (response.data) {
        const languages = response.data.data || response.data;
        const languageOptions = languages.map((lang: any) => ({
          code: lang.code,
          name: lang.name
        }));
        setAvailableLanguages(languageOptions);
      }
    } catch (error) {
      console.error(error);
      setAvailableLanguages([
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' }
      ]);
    }
  };

  const fetchCMSContent = async () => {
    try {
      setLoading(true);
      const response = await getCMSList({ page: 1, limit: 10, search: id, language: 'en' });
      if (response.success && response.data && response.data.length > 0) {
        const item = response.data.find((item: any) => item.id.toString() === id || item.key === id);
        if (item) {
          setCmsItem(item);
          setFormData({
            title: item.title || '',
            content: item.content || '',
            key: item.key || ''
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSContent();
    fetchLanguages();
  }, [id]);

  const handleUpdate = async () => {
    try {
      if (!cmsItem) return;

      const translations = [];
      
      for (const langCode of selectedLanguagesForEdit) {
        try {
          if (langCode === 'en') {
            translations.push({
              languageCode: 'en',
              title: formData.title,
              content: formData.content
            });
          } else {
            const translatedTitle = await translateText(formData.title, langCode);
            const translatedContent = await translateText(formData.content, langCode);
            
            translations.push({
              languageCode: langCode,
              title: translatedTitle,
              content: translatedContent
            });
          }
        } catch (error) {
          console.error(error);
          translations.push({
            languageCode: langCode,
            title: formData.title,
            content: formData.content
          });
        }
      }
      
      await updateCMS(cmsItem.id, {
        key: formData.key,
        translations: translations
      });
      
      notificationService.success('CMS Content updated successfully');
      
      setIsEditing(false);
      fetchCMSContent();
    } catch (error) {
      console.error(error);
      notificationService.error('Failed to update CMS Content');
    }
  };

  const handleTranslate = async () => {
    if (!formData.content || selectedLanguagesForEdit.length === 0) return;
    
    try {
      const targetLang = selectedLanguagesForEdit[0];
      const translated = await translateText(formData.content, targetLang);
      setFormData(prev => ({ ...prev, content: translated }));
      notificationService.success('Translation completed');
    } catch (error) {
      console.error(error);
      notificationService.error('Failed to translate content');
    }
  };

  const handleDelete = async () => {
    if (!cmsItem) return;
    
    if (window.confirm('Are you sure you want to delete this CMS item?')) {
      try {
        await deleteCMS(cmsItem.id);
        notificationService.success('CMS Content deleted');
        navigate('/home/cms');
      } catch (error) {
        console.error(error);
        notificationService.error('Failed to delete CMS Content');
      }
    }
  };

  return {
    cmsItem,
    loading,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    selectedLanguagesForEdit,
    setSelectedLanguagesForEdit,
    showEditLanguageDropdown,
    setShowEditLanguageDropdown,
    availableLanguages,
    handleUpdate,
    handleTranslate,
    handleDelete,
    navigate
  };
};
