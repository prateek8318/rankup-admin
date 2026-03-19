import { useState, useCallback } from 'react';
import { ExamDto, CreateExamDto, UpdateExamDto } from '@/services/examsApi';

export interface ExamFormData {
  name: string;
  description: string;
  countryCode: string;
  minAge: number;
  maxAge: number;
  names: Array<{ languageId: number; name: string; description: string }>;
  qualificationIds: number[];
  streamIds: number[];
}

export interface ExamFormState {
  formData: ExamFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

const initialFormData: ExamFormData = {
  name: '',
  description: '',
  countryCode: '',
  minAge: 18,
  maxAge: 60,
  names: [],
  qualificationIds: [],
  streamIds: []
};

export const useExamForm = (initialExam?: ExamDto) => {
  const [formState, setFormState] = useState<ExamFormState>({
    formData: initialExam ? {
      name: initialExam.name,
      description: initialExam.description,
      countryCode: initialExam.countryCode,
      minAge: initialExam.minAge,
      maxAge: initialExam.maxAge,
      names: initialExam.names || [],
      qualificationIds: initialExam.qualificationIds || [],
      streamIds: initialExam.streamIds || []
    } : initialFormData,
    errors: {},
    isSubmitting: false,
    isValid: false
  });

  const validateForm = useCallback((formData: ExamFormData, isInternationalFlag: boolean): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Exam name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!isInternationalFlag && !formData.countryCode) {
      errors.countryCode = 'Country is required';
    }

    if (!formData.qualificationIds || formData.qualificationIds.length === 0) {
      errors.qualificationIds = 'At least one qualification is required';
    }

    if (formData.minAge < 18) {
      errors.minAge = 'Minimum age must be at least 18';
    }

    if (formData.maxAge > 60) {
      errors.maxAge = 'Maximum age cannot exceed 60';
    }

    if (formData.minAge >= 18 && formData.maxAge >= 18 && formData.minAge > formData.maxAge) {
      errors.ageRange = 'Minimum age cannot be greater than maximum age';
    }

    return errors;
  }, []);

  const updateFormData = useCallback((updates: Partial<ExamFormData>) => {
    setFormState(prev => {
      const newFormData = { ...prev.formData, ...updates };
      const errors = validateForm(newFormData, newFormData.countryCode !== 'IN');
      return {
        ...prev,
        formData: newFormData,
        errors,
        isValid: Object.keys(errors).length === 0
      };
    });
  }, [validateForm]);

  const setErrors = useCallback((errors: Record<string, string>) => {
    setFormState(prev => ({ ...prev, errors }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
      isValid: false
    });
  }, []);

  return {
    formState,
    updateFormData,
    setErrors,
    setSubmitting,
    resetForm,
    validateForm
  };
};
