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

  const resetForm = () => {
    setFormData(createInitialFormData());
    setEditingCountry(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setFormData(createInitialFormData());
    setEditingCountry(null);
    setShowModal(true);
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
    setShowModal(true);
  };

  const handleNameEnChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, name: value, nameEn: value }));

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const success = await saveCountry(formData, editingCountry);

    if (success) {
      resetForm();
    }
  };

  return {
    autoTranslate,
    editingCountry,
    formData,
    handleNameEnChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    setFormData,
    showModal,
  };
};
