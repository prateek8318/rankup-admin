import type { FormEvent } from 'react';
import { useState } from 'react';
import { CreateSubjectDto, SubjectDto } from '@/services/masterApi';
import { createInitialSubjectFormData } from '../subjectUtils';

interface UseSubjectFormParams {
  saveSubject: (formData: CreateSubjectDto, editingSubject: SubjectDto | null) => Promise<boolean>;
}

export const useSubjectForm = ({ saveSubject }: UseSubjectFormParams) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isTranslating] = useState(false);
  const [formData, setFormData] = useState<CreateSubjectDto>(createInitialSubjectFormData);

  const resetForm = () => {
    setFormData(createInitialSubjectFormData());
    setEditingSubject(null);
    setShowModal(false);
  };

  const openCreateModal = () => {
    setFormData(createInitialSubjectFormData());
    setEditingSubject(null);
    setShowModal(true);
  };

  const openEditModal = (subject: SubjectDto) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || '',
      names: subject.names || [],
      isActive: subject.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const success = await saveSubject(formData, editingSubject);

    if (success) {
      resetForm();
    }
  };

  return {
    autoTranslate,
    editingSubject,
    formData,
    handleSubmit,
    isTranslating,
    openCreateModal,
    openEditModal,
    resetForm,
    setAutoTranslate,
    setFormData,
    showModal,
  };
};
