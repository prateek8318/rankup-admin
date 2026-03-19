import { useState, useEffect } from 'react';
import { getCMSList, createCMS, deleteCMS, updateCMSStatus } from '@/services/dashboardApi';
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

export const useCMSList = () => {
  const [cmsItems, setCmsItems] = useState<CMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content: '',
    language: 'en'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedLanguagesForModal, setSelectedLanguagesForModal] = useState<string[]>(['en']);
  const [showModalLanguageDropdown, setShowModalLanguageDropdown] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [availableLanguages, setAvailableLanguages] = useState<{ code: string; name: string }[]>([]);
  const [selectedLanguagesFilter, setSelectedLanguagesFilter] = useState<string[]>([]);
  const [showLanguageFilter, setShowLanguageFilter] = useState(false);

  const fetchCMSItems = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      
      if (selectedLanguagesFilter.length === 1) {
        params.language = selectedLanguagesFilter[0];
      } else if (selectedLanguagesFilter.length > 1) {
        params.languages = selectedLanguagesFilter.join(',');
      }
      
      const response = await getCMSList(params);
      if (response.success) {
        setCmsItems(response.data || []);
        setTotalItems(response.total || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  useEffect(() => {
    fetchCMSItems();
    fetchLanguages();
  }, [currentPage, searchTerm, selectedLanguagesFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const translations = [];
      
      for (const langCode of selectedLanguagesForModal) {
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
      
      await createCMS({
        key: formData.key,
        translations: translations
      });
      
      notificationService.success('CMS Content added successfully');
      
      setIsModalOpen(false);
      setFormData({ key: '', title: '', content: '', language: 'en' });
      setTranslatedContent('');
      setSelectedLanguagesForModal(['en']);
      fetchCMSItems();
    } catch (error) {
      console.error(error);
      notificationService.error('Failed to create CMS document');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this CMS item?')) {
      try {
        await deleteCMS(id);
        notificationService.success('Deleted successfully');
        fetchCMSItems();
      } catch (error) {
        console.error(error);
        notificationService.error('Delete failed');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateCMSStatus(id, newStatus === 'Active');
      notificationService.success('Status updated');
      fetchCMSItems();
    } catch (error) {
      console.error(error);
      notificationService.error('Failed to change status');
    }
  };

  const handleLanguageFilterToggle = (languageCode: string) => {
    setSelectedLanguagesFilter(prev => {
      if (prev.includes(languageCode)) {
        return [];
      } else {
        return [languageCode];
      }
    });
    setShowLanguageFilter(false);
  };

  const clearLanguageFilter = () => {
    setSelectedLanguagesFilter([]);
  };

  const languages = availableLanguages.length > 0 ? availableLanguages : [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' }
  ];

  return {
    cmsItems,
    loading,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalItems,
    selectedLanguagesForModal,
    setSelectedLanguagesForModal,
    showModalLanguageDropdown,
    setShowModalLanguageDropdown,
    translatedContent,
    setTranslatedContent,
    languages,
    selectedLanguagesFilter,
    showLanguageFilter,
    setShowLanguageFilter,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleLanguageFilterToggle,
    clearLanguageFilter,
  };
};
