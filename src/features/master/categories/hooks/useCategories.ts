import { useCallback, useEffect, useState } from 'react';
import { categoryApi, CategoryDto, CreateCategoryDto } from '@/services/masterApi';
import { errorHandlingService } from '@/services/errorHandlingService';
import { notificationService } from '@/services/notificationService';

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
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await categoryApi.delete(id);
      await fetchCategories();
      notificationService.success('Category deleted successfully');
    } catch (error) {
      errorHandlingService.handleError(error, 'deleteCategory');
    }
  };

  const saveCategory = async (
    formData: CreateCategoryDto,
    editingCategory: CategoryDto | null,
  ) => {
    try {
      // Log the request payload for debugging
      console.log('Saving category with data:', formData);
      
      // Validate required fields
      if (!formData.nameEn?.trim()) {
        throw new Error('English name is required');
      }
      if (!formData.key?.trim()) {
        throw new Error('Key is required');
      }
      if (!formData.type) {
        throw new Error('Type is required');
      }

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, { ...formData, id: editingCategory.id });
        notificationService.success('Category updated successfully');
      } else {
        await categoryApi.create(formData);
        notificationService.success('Category created successfully');
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
