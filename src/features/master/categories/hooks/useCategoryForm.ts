import type { FormEvent } from 'react';
import { useState } from 'react';
import { CategoryDto, CreateCategoryDto } from '@/services/masterApi';
import { translateText } from '@/utils/translate';

const createInitialFormData = (): CreateCategoryDto => ({
  nameEn: '',
  nameHi: '',
  key: '',
  type: 'category',
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

  const resetForm = () => {
    setFormData(createInitialFormData());
    setEditingCategory(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setFormData(createInitialFormData());
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category: CategoryDto) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.nameEn,
      nameHi: category.nameHi || '',
      key: category.key,
      type: category.type,
    });
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
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const success = await saveCategory(formData, editingCategory);

    if (success) {
      resetForm();
    }
  };

  return {
    autoTranslate,
    editingCategory,
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
