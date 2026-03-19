import { useCallback, useEffect, useState } from 'react';
import { categoryApi, CategoryDto, CreateCategoryDto } from '@/services/masterApi';
import { errorHandlingService } from '@/services/errorHandlingService';

export type CategoryLanguage = 'en' | 'hi';

const normalizeCategories = (response: any): CategoryDto[] => {
  if (response?.data?.success && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [];
};

export const useCategories = (selectedLanguage: CategoryLanguage) => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getCategories(selectedLanguage);
      setCategories(normalizeCategories(response));
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchCategories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this category?')) {
      return;
    }

    try {
      await categoryApi.updateStatus(id, false);
      await fetchCategories();
    } catch (error) {
      errorHandlingService.handleError(error, 'deactivateCategory');
    }
  };

  const saveCategory = async (
    formData: CreateCategoryDto,
    editingCategory: CategoryDto | null,
  ) => {
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, { ...formData, id: editingCategory.id });
      } else {
        await categoryApi.create(formData);
      }

      await fetchCategories();
      return true;
    } catch (error) {
      errorHandlingService.handleError(error, 'saveCategory');
      return false;
    }
  };

  return {
    categories,
    deleteCategory,
    loading,
    saveCategory,
  };
};
