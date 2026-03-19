import type { FormEvent } from 'react';
import { useState } from 'react';
import { CreateStateDto, LanguageDto, StateDto } from '@/services/masterApi';
import { translateText } from '@/utils/translate';
import {
  createInitialStateFormData,
  updateStateTranslation,
} from '../stateUtils';

interface UseStateFormParams {
  languages: LanguageDto[];
  saveState: (formData: CreateStateDto, editingState: StateDto | null) => Promise<boolean>;
}

export const useStateForm = ({ languages, saveState }: UseStateFormParams) => {
  const [showModal, setShowModal] = useState(false);
  const [editingState, setEditingState] = useState<StateDto | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateStateDto>(createInitialStateFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData(createInitialStateFormData());
    setEditingState(null);
    setShowModal(false);
    setErrors({});
  };

  const openCreateModal = () => {
    setFormData(createInitialStateFormData());
    setEditingState(null);
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (state: StateDto) => {
    setEditingState(state);
    setFormData({
      name: state.name,
      code: state.code,
      countryCode: state.countryCode,
      names: state.names || [],
      isActive: state.isActive,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleTranslationChange = (languageId: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      names: updateStateTranslation(prev.names || [], languageId, value),
    }));
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    // Clear error when user starts typing
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }

    if (!formData.names?.length || !value.trim()) {
      return;
    }

    const translateToAllLanguages = async () => {
      setIsTranslating(true);

      try {
        const translatedNames = await Promise.all(
          (formData.names || []).map(async (nameObj) => {
            const language = languages.find((entry) => entry.id === nameObj.languageId);

            if (language && language.code !== 'en') {
              const translatedName = await translateText(value, language.code);
              return { ...nameObj, name: translatedName };
            }

            return nameObj;
          }),
        );

        setFormData((prev) => ({ ...prev, name: value, names: translatedNames }));
      } finally {
        setIsTranslating(false);
      }
    };

    void translateToAllLanguages();
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
    // Clear error when user starts typing
    if (errors.countryCode) {
      setErrors((prev) => ({ ...prev, countryCode: '' }));
    }
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

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'State name is required';
    }

    if (!formData.countryCode || formData.countryCode.trim().length === 0) {
      newErrors.countryCode = 'Country selection is required';
    }

    if (!formData.code || formData.code.trim().length === 0) {
      newErrors.code = 'State code is required';
    } else if (formData.code.length !== 2) {
      newErrors.code = 'State code must be exactly 2 characters';
    } else if (!/^[A-Z]{2}$/.test(formData.code)) {
      newErrors.code = 'State code must be 2 uppercase letters';
    }

    if (!formData.names || formData.names.length === 0) {
      newErrors.names = 'At least one language must be selected';
    } else {
      // Check if all selected languages have translations
      const missingTranslations = formData.names.some(name => !name.name || name.name.trim().length === 0);
      if (missingTranslations) {
        newErrors.names = 'All selected languages must have translations';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLanguageToggle = async (languageId: number) => {
    const names = formData.names || [];
    const isSelected = names.some((name) => name.languageId === languageId);

    if (isSelected) {
      setFormData((prev) => ({
        ...prev,
        names: (prev.names || []).filter((name) => name.languageId !== languageId),
      }));
      return;
    }

    setIsTranslating(true);

    try {
      const language = languages.find((entry) => entry.id === languageId);
      const translatedName = language && language.code !== 'en'
        ? await translateText(formData.name, language.code)
        : formData.name;

      setFormData((prev) => ({
        ...prev,
        names: [...(prev.names || []), { languageId, name: translatedName }],
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await saveState(formData, editingState);

    if (success) {
      resetForm();
    }
  };

  return {
    editingState,
    errors,
    formData,
    handleCountryChange,
    handleLanguageToggle,
    handleNameChange,
    handleCodeChange,
    handleSubmit,
    handleTranslationChange,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    setFormData,
    showModal,
  };
};
