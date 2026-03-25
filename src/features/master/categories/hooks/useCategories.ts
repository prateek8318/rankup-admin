import { useCallback, useEffect, useState } from 'react';
import { categoryApi, CategoryDto, CreateCategoryDto } from '@/services/masterApi';
import { getUserFriendlyErrorMessage } from '@/services/errorHandlingService';
import { notificationService } from '@/services/notificationService';
import { useMasterDataStore } from '@/context/MasterDataContext';

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
  const { featureState, dispatch } = useMasterDataStore('categories');

  const fetchCategories = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_START', feature: 'categories' });
      const response = await categoryApi.getCategories(selectedLanguage);
      setCategories(normalizeCategories(response));
      dispatch({ type: 'FETCH_SUCCESS', feature: 'categories' });
    } catch (error) {
      dispatch({
        type: 'REQUEST_ERROR',
        feature: 'categories',
        message: getUserFriendlyErrorMessage(error),
      });
      setCategories([]);
    }
  }, [dispatch, selectedLanguage]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const requestDeleteCategory = (category: CategoryDto) => {
    dispatch({
      type: 'SET_PENDING_DELETE',
      feature: 'categories',
      id: category.id,
      label: category.nameEn,
    });
  };

  const cancelDeleteCategory = () => {
    dispatch({ type: 'RESET_DELETE_STATE', feature: 'categories' });
  };

  const confirmDeleteCategory = async () => {
    if (!featureState.pendingDeleteId) {
      return;
    }
    try {
      dispatch({
        type: 'DELETE_START',
        feature: 'categories',
        id: featureState.pendingDeleteId,
      });
      await categoryApi.delete(featureState.pendingDeleteId);
      await fetchCategories();
      dispatch({
        type: 'DELETE_SUCCESS',
        feature: 'categories',
        message: 'Category deleted successfully',
      });
      notificationService.success('Category deleted successfully');
    } catch (error) {
      dispatch({
        type: 'REQUEST_ERROR',
        feature: 'categories',
        message: getUserFriendlyErrorMessage(error),
      });
    }
  };

  const saveCategory = async (
    formData: CreateCategoryDto,
    editingCategory: CategoryDto | null,
  ) => {
    try {
      dispatch({ type: 'SAVE_START', feature: 'categories' });
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
        dispatch({
          type: 'SAVE_SUCCESS',
          feature: 'categories',
          message: 'Category updated successfully',
        });
        notificationService.success('Category updated successfully');
      } else {
        await categoryApi.create(formData);
        dispatch({
          type: 'SAVE_SUCCESS',
          feature: 'categories',
          message: 'Category created successfully',
        });
        notificationService.success('Category created successfully');
      }

      await fetchCategories();
      return true;
    } catch (error) {
      dispatch({
        type: 'REQUEST_ERROR',
        feature: 'categories',
        message: getUserFriendlyErrorMessage(error),
      });
      return false;
    }
  };

  const clearSuccessMessage = () => {
    dispatch({ type: 'CLEAR_SUCCESS', feature: 'categories' });
  };

  return {
    categories,
    requestDeleteCategory,
    confirmDeleteCategory,
    cancelDeleteCategory,
    pendingDeleteId: featureState.pendingDeleteId,
    pendingDeleteLabel: featureState.pendingDeleteLabel,
    loading: featureState.loading,
    saving: featureState.saving,
    deletingId: featureState.deletingId,
    error: featureState.error,
    successMessage: featureState.successMessage,
    clearSuccessMessage,
    saveCategory,
  };
};
