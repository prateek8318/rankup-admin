import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { notificationService } from '@/services/notificationService';
import { getCroppedImg } from '@/utils/cropImage';
import { CreateExamDto, ExamDto } from '@/services/examsApi';
import { LanguageDto } from '@/types/qualification';
import { translateText } from '@/utils/translate';
import {
  createInitialExamFormData,
  validateExamForm,
  validateExamImage,
} from '../examUtils';

interface UseExamFormParams {
  languages: LanguageDto[];
  saveExam: (
    formData: CreateExamDto,
    editingExam: ExamDto | null,
    imageFile: File | null,
    isInternationalFlag: boolean,
  ) => Promise<boolean>;
}

export const useExamForm = ({ languages, saveExam }: UseExamFormParams) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isInternationalFlag, setIsInternationalFlag] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamDto | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateExamDto>(createInitialExamFormData);

  useEffect(() => {
    if (formData.countryCode === 'IN' && isInternationalFlag) {
      setIsInternationalFlag(false);
    }
  }, [formData.countryCode, isInternationalFlag]);

  useEffect(() => {
    if (!formData.name || !formData.names?.length) {
      return;
    }

    const translateAll = async () => {
      setIsTranslating(true);

      try {
        const updated = await Promise.all(formData.names.map(async (name) => {
          const language = languages.find((entry) => entry.id === name.languageId);

          if (language?.code && language.code !== 'en') {
            const translatedName = await translateText(formData.name, language.code);
            const translatedDescription = await translateText(formData.description || '', language.code);
            return { ...name, name: translatedName, description: translatedDescription };
          }

          return name;
        }));

        setFormData((prev) => ({ ...prev, names: updated }));
      } finally {
        setIsTranslating(false);
      }
    };

    void translateAll();
  }, [formData.name, languages]);

  const resetForm = useCallback(() => {
    setShowModal(false);
    setEditingExam(null);
    setFormData(createInitialExamFormData());
    setSelectedLanguages([]);
    setImageFile(null);
    setCroppedImage(null);
    setIsInternationalFlag(false);
    setErrors({});
  }, []);

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (exam: ExamDto) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      description: exam.description,
      countryCode: exam.countryCode,
      minAge: exam.minAge,
      maxAge: exam.maxAge,
      names: exam.names || [],
      qualificationIds: exam.qualificationIds || [],
      streamIds: exam.streamIds || [],
    });
    setSelectedLanguages((exam.names || []).map((name) => name.languageId));
    setImageFile(null);
    setCroppedImage(null);
    setIsInternationalFlag(exam.countryCode !== 'IN');
    setErrors({});
    setShowModal(true);
  };

  const handleDeleteClose = () => {
    resetForm();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const error = validateExamImage(file);

    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      return;
    }

    setErrors((prev) => {
      const { image, ...rest } = prev;
      return rest;
    });
    setImageFile(file);
    setShowCropModal(true);
  };

  const handleCropConfirm = async () => {
    if (!imageFile || !croppedAreaPixels) {
      return;
    }

    try {
      const croppedImg = await getCroppedImg(imageFile, croppedAreaPixels);
      setCroppedImage(croppedImg);

      const blob = await fetch(croppedImg).then((response) => response.blob());
      const croppedFile = new File([blob], imageFile.name, { type: imageFile.type });
      setImageFile(croppedFile);
      setShowCropModal(false);
    } catch (error) {
      notificationService.error('Failed to crop image');
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageFile(null);
    setCroppedImage(null);
  };

  const handleLanguageToggle = async (languageId: number) => {
    const names = formData.names || [];
    const isSelected = selectedLanguages.includes(languageId);

    if (isSelected) {
      setSelectedLanguages((prev) => prev.filter((id) => id !== languageId));
      setFormData((prev) => ({
        ...prev,
        names: (prev.names || []).filter((name) => name.languageId !== languageId),
      }));
      return;
    }

    setSelectedLanguages((prev) => [...prev, languageId]);
    setIsTranslating(true);

    try {
      const language = languages.find((entry) => entry.id === languageId);
      const translatedName = language?.code && language.code !== 'en'
        ? await translateText(formData.name || '', language.code)
        : formData.name || '';
      const translatedDescription = language?.code && language.code !== 'en'
        ? await translateText(formData.description || '', language.code)
        : formData.description || '';

      setFormData((prev) => ({
        ...prev,
        names: [
          ...(prev.names || []),
          { languageId, name: translatedName, description: translatedDescription },
        ],
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleIdInList = (field: 'qualificationIds' | 'streamIds', value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((id) => id !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validateExamForm(formData, isInternationalFlag);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const success = await saveExam(formData, editingExam, imageFile, isInternationalFlag);

    if (success) {
      resetForm();
    }
  };

  return {
    crop,
    croppedImage,
    errors,
    formData,
    handleCropCancel,
    handleCropConfirm,
    handleDeleteClose,
    handleImageChange,
    handleLanguageToggle,
    handleSubmit,
    imageFile,
    isInternationalFlag,
    isTranslating,
    openCreateModal,
    openEditModal,
    setCrop,
    setCroppedAreaPixels,
    setFormData,
    setIsInternationalFlag,
    selectedLanguages,
    setZoom,
    showCropModal,
    showModal,
    zoom,
    editingExam,
  };
};
