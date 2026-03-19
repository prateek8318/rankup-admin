import type { FormEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
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

  const resetForm = () => {
    setFormData(createInitialQualificationFormData());
    setSelectedLanguages([]);
    setEditingQualification(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setFormData(createInitialQualificationFormData());
    setSelectedLanguages([]);
    setEditingQualification(null);
    setShowModal(true);
  };

  const openEditModal = (qualification: QualificationDto) => {
    setEditingQualification(qualification);
    setFormData({
      name: qualification.name,
      description: qualification.description,
      countryCode: qualification.countryCode,
      names: qualification.names,
    });
    setSelectedLanguages(qualification.names.map((name) => name.languageId));
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

    if (formData.names.length > 0 && value.trim()) {
      void translateExistingField('name', value);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));

    if (formData.names.length > 0 && value.trim()) {
      void translateExistingField('description', value);
    }
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

    if (!formData.name || !formData.description || !formData.countryCode) {
      toast.error('Please fill all required fields');
      return;
    }

    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language');
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
    formData,
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
