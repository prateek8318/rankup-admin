import type { FormEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CreateStreamDto, LanguageDto, StreamDto } from '@/types/qualification';
import { translateText } from '@/utils/translate';
import {
  createInitialStreamFormData,
  getLanguageById,
  updateStreamTranslation,
} from '../streamUtils';

interface UseStreamFormParams {
  languages: LanguageDto[];
  saveStream: (formData: CreateStreamDto, editingStream: StreamDto | null) => Promise<boolean>;
}

export const useStreamForm = ({ languages, saveStream }: UseStreamFormParams) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStream, setEditingStream] = useState<StreamDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateStreamDto>(createInitialStreamFormData);

  const resetForm = () => {
    setFormData(createInitialStreamFormData());
    setSelectedLanguages([]);
    setEditingStream(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (stream: StreamDto) => {
    setEditingStream(stream);
    setFormData({
      name: stream.name,
      description: stream.description,
      qualificationId: stream.qualificationId,
      names: stream.names,
    });
    setSelectedLanguages(stream.names.map((name) => name.languageId));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTranslationFieldChange = (
    languageId: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      names: updateStreamTranslation(prev.names, languageId, { [field]: value }),
    }));
  };

  const translateExistingField = async (field: 'name' | 'description', value: string) => {
    setIsTranslating(true);

    try {
      const translatedNames = await Promise.all(
        formData.names.map(async (nameObj) => {
          const language = getLanguageById(languages, nameObj.languageId);

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
    const isCurrentlySelected = selectedLanguages.includes(languageId);

    if (isCurrentlySelected) {
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
        const language = getLanguageById(languages, languageId);

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

  const handleQualificationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      qualificationId: Number.parseInt(value, 10),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!formData.name || !formData.description || !formData.qualificationId) {
      toast.error('Please fill all required fields');
      return;
    }

    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language');
      return;
    }

    const success = await saveStream(formData, editingStream);

    if (success) {
      resetForm();
      setShowModal(false);
    }
  };

  return {
    autoTranslate,
    closeModal,
    editingStream,
    formData,
    handleDescriptionChange,
    handleLanguageToggle,
    handleNameChange,
    handleQualificationChange,
    handleSubmit,
    handleTranslationFieldChange,
    isTranslating,
    openCreateModal,
    openEditModal,
    selectedLanguages,
    setAutoTranslate,
    showModal,
  };
};
