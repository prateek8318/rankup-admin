import type { FormEvent } from 'react';
import { useState } from 'react';
import { notificationService } from "@/services/notificationService";
import { CreateQualificationDto, LanguageDto, QualificationDto } from '@/types/qualification';
import { translateText } from '@/utils/translate';
import {
  createInitialQualificationFormData,
  updateQualificationTranslation,
} from '../qualificationUtils';

interface UseQualificationFormParams {
  languages: LanguageDto[];
  saveQualification: (
    formData: CreateQualificationDto,
    editingQualification: QualificationDto | null,
  ) => Promise<boolean>;
}

export const useQualificationForm = ({
  languages,
  saveQualification,
}: UseQualificationFormParams) => {
  const [showModal, setShowModal] = useState(false);
  const [editingQualification, setEditingQualification] = useState<QualificationDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateQualificationDto>(createInitialQualificationFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData(createInitialQualificationFormData());
    setSelectedLanguages([]);
    setEditingQualification(null);
    setShowModal(false);
    setErrors({});
  };

  const openCreateModal = () => {
    setFormData(createInitialQualificationFormData());
    setSelectedLanguages([]);
    setEditingQualification(null);
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (qualification: QualificationDto) => {
    setEditingQualification(qualification);
    setFormData({
      name: qualification.name,
      description: qualification.description,
      countryCode: qualification.countryCode,
      names: qualification.names,
    });
    setSelectedLanguages(qualification.names?.map((name) => name.languageId) || []);
    setErrors({});
    setShowModal(true);
  };

  const handleTranslationFieldChange = (
    languageId: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      names: updateQualificationTranslation(prev.names, languageId, { [field]: value }),
    }));
  };

  const translateExistingField = async (field: 'name' | 'description', value: string) => {
    setIsTranslating(true);

    try {
      const translatedNames = await Promise.all(
        formData.names.map(async (nameObj) => {
          const language = languages.find((entry) => entry.id === nameObj.languageId);

          if (language && language.code !== 'en') {
            const translatedValue = await translateText(value, language.code);
            return { ...nameObj, [field]: translatedValue };
          }

          return nameObj;
        }),
      );

      setFormData((prev) => ({ ...prev, [field]: value, names: translatedNames }));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    // Clear error when user starts typing
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }

    if (formData.names.length > 0 && value.trim()) {
      void translateExistingField('name', value);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
    // Clear error when user starts typing
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: '' }));
    }

    if (formData.names.length > 0 && value.trim()) {
      void translateExistingField('description', value);
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
    // Clear error when user starts typing
    if (errors.countryCode) {
      setErrors((prev) => ({ ...prev, countryCode: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Qualification name is required';
    }

    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = 'Description is required';
    }

    if (!formData.countryCode || formData.countryCode.trim().length === 0) {
      newErrors.countryCode = 'Country selection is required';
    }

    if (selectedLanguages.length === 0) {
      newErrors.languages = 'At least one language must be selected';
    } else {
      // Check if all selected languages have translations
      const missingTranslations = selectedLanguages.some(langId => {
        const translation = formData.names.find(name => name.languageId === langId);
        return !translation || !translation.name || translation.name.trim().length === 0;
      });
      if (missingTranslations) {
        newErrors.languages = 'All selected languages must have name translations';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLanguageToggle = async (languageId: number) => {
    const isSelected = selectedLanguages.includes(languageId);

    if (isSelected) {
      setSelectedLanguages((prev) => prev.filter((id) => id !== languageId));
      setFormData((prev) => ({
        ...prev,
        names: prev.names.filter((name) => name.languageId !== languageId),
      }));
      return;
    }

    setSelectedLanguages((prev) => [...prev, languageId]);

    if (autoTranslate && formData.name && formData.description) {
      setIsTranslating(true);

      try {
        const language = languages.find((entry) => entry.id === languageId);

        if (!language) {
          return;
        }

        const translatedName = language.code === 'en'
          ? formData.name
          : await translateText(formData.name, language.code);
        const translatedDescription = language.code === 'en'
          ? formData.description
          : await translateText(formData.description, language.code);

        setFormData((prev) => ({
          ...prev,
          names: [
            ...prev.names,
            { languageId, name: translatedName, description: translatedDescription },
          ],
        }));
      } finally {
        setIsTranslating(false);
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      names: [
        ...prev.names,
        { languageId, name: prev.name, description: prev.description },
      ],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await saveQualification(formData, editingQualification);

    if (success) {
      resetForm();
    }
  };

  return {
    autoTranslate,
    editingQualification,
    errors,
    formData,
    handleCountryChange,
    handleDescriptionChange,
    handleLanguageToggle,
    handleNameChange,
    handleSubmit,
    handleTranslationFieldChange,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    selectedLanguages,
    setAutoTranslate,
    setFormData,
    showModal,
  };
};

