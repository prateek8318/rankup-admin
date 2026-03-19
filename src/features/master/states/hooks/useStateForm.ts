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

  const resetForm = () => {
    setFormData(createInitialStateFormData());
    setEditingState(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setFormData(createInitialStateFormData());
    setEditingState(null);
    setShowModal(true);
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
    const success = await saveState(formData, editingState);

    if (success) {
      resetForm();
    }
  };

  return {
    editingState,
    formData,
    handleLanguageToggle,
    handleNameChange,
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
