import type { FormEvent } from 'react';
import { useState } from 'react';
import { CountryDto, CreateCountryDto } from '@/services/masterApi';
import { translateText } from '@/utils/translate';

const createInitialFormData = (): CreateCountryDto => ({
  name: '',
  nameEn: '',
  nameHi: '',
  code: '',
  subdivisionLabelEn: 'State',
  subdivisionLabelHi: 'राज्य',
  isActive: true,
});

interface UseCountryFormParams {
  saveCountry: (formData: CreateCountryDto, editingCountry: CountryDto | null) => Promise<boolean>;
}

export const useCountryForm = ({ saveCountry }: UseCountryFormParams) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryDto | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [formData, setFormData] = useState<CreateCountryDto>(createInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData(createInitialFormData());
    setEditingCountry(null);
    setShowModal(false);
    setErrors({});
  };

  const openCreateModal = () => {
    setFormData(createInitialFormData());
    setEditingCountry(null);
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (country: CountryDto) => {
    setEditingCountry(country);
    setFormData({
      name: country.nameEn || country.name,
      nameEn: country.nameEn || country.name,
      nameHi: country.nameHi || '',
      code: country.code,
      subdivisionLabelEn: (country as any).subdivisionLabelEn || 'State',
      subdivisionLabelHi: (country as any).subdivisionLabelHi || 'राज्य',
      isActive: country.isActive,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleNameEnChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value, nameEn: value }));
    // Clear error when user starts typing
    if (errors.nameEn) {
      setErrors((prev) => ({ ...prev, nameEn: '' }));
    }

    if (!autoTranslate || !value.trim()) {
      return;
    }

    try {
      const hindiTranslation = await translateText(value, 'hi');
      setFormData((prev) => ({ ...prev, nameHi: hindiTranslation, name: value }));
    } catch (error) {
      ;
    }
  };

  const handleNameHiChange = (value: string) => {
    setFormData((prev) => ({ ...prev, nameHi: value }));
  };

  const handleCodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, code: value.toUpperCase() }));
    // Clear error when user starts typing
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameEn || formData.nameEn.trim().length === 0) {
      newErrors.nameEn = 'Country name is required';
    }

    if (!formData.code || formData.code.trim().length === 0) {
      newErrors.code = 'Country code is required';
    } else if (formData.code.length !== 2) {
      newErrors.code = 'Country code must be exactly 2 characters';
    } else if (!/^[A-Z]{2}$/.test(formData.code)) {
      newErrors.code = 'Country code must be 2 uppercase letters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await saveCountry(formData, editingCountry);

    if (success) {
      resetForm();
    }
  };

  return {
    autoTranslate,
    editingCountry,
    errors,
    formData,
    handleNameEnChange,
    handleNameHiChange,
    handleCodeChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    setFormData,
    showModal,
  };
};
