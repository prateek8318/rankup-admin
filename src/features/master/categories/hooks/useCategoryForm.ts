import type { FormEvent } from 'react';
import { useState } from 'react';
import { CategoryDto, CreateCategoryDto } from '@/services/masterApi';
import { translateText } from '@/utils/translate';

const createInitialFormData = (): CreateCategoryDto => ({
  nameEn: '',
  nameHi: '',
  key: '',
  type: 'category',
  status: 'active',
});

interface UseCategoryFormParams {
  saveCategory: (formData: CreateCategoryDto, editingCategory: CategoryDto | null) => Promise<boolean>;
}

export const useCategoryForm = ({ saveCategory }: UseCategoryFormParams) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDto>(createInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData(createInitialFormData());
    setEditingCategory(null);
    setShowModal(false);
    setErrors({});
  };

  const openCreateModal = () => {
    setFormData(createInitialFormData());
    setEditingCategory(null);
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (category: CategoryDto) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.nameEn,
      nameHi: category.nameHi || '',
      key: category.key,
      type: category.type,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleNameEnChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, nameEn: value }));

    if (!autoTranslate || !value.trim()) {
      return;
    }

    setIsTranslating(true);

    try {
      const translatedHindi = await translateText(value, 'hi');
      setFormData((prev) => ({ ...prev, nameHi: translatedHindi }));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleNameHiChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, nameHi: value }));

    if (!autoTranslate || !value.trim()) {
      return;
    }

    setIsTranslating(true);

    try {
      const translatedEnglish = await translateText(value, 'en');
      setFormData((prev) => ({ ...prev, nameEn: translatedEnglish }));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleKeyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, key: value.toLowerCase() }));
    // Clear error when user starts typing
    if (errors.key) {
      setErrors((prev) => ({ ...prev, key: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameEn || formData.nameEn.trim().length === 0) {
      newErrors.nameEn = 'Category name is required';
    }

    if (!formData.key || formData.key.trim().length === 0) {
      newErrors.key = 'Category key is required';
    } else if (!/^[a-z0-9_-]+$/.test(formData.key)) {
      newErrors.key = 'Key must contain only lowercase letters, numbers, underscores, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await saveCategory(formData, editingCategory);

    if (success) {
      resetForm();
    }
  };

  return {
    autoTranslate,
    editingCategory,
    errors,
    formData,
    handleKeyChange,
    handleNameEnChange,
    handleNameHiChange,
    handleSubmit,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    showModal,
  };
};
