import { useCallback, useEffect, useState } from 'react';
import {
  languageApi,
  LanguageDto,
  subjectApi,
  SubjectDto,
  CreateSubjectDto,
} from '@/services/masterApi';
import { notificationService } from '@/services/notificationService';

const normalizeArray = <T,>(response: any): T[] => {
  const data = response?.data?.data || response?.data || response || [];
  return Array.isArray(data) ? data : [];
};

const normalizeSubjects = (response: any): SubjectDto[] => normalizeArray<any>(response).map((subject) => ({
  ...subject,
  names: subject.subjectLanguages || subject.names || [],
}));

export const useSubjects = (selectedLanguageIdFilter: number | null) => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);

    try {
      const response = await subjectApi.getAll();
      setSubjects(normalizeSubjects(response));
    } catch (error) {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    setLanguagesLoading(true);

    try {
      const response = await languageApi.getAll();
      setLanguages(normalizeArray<LanguageDto>(response));
    } catch (error) {
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSubjects();
    void fetchLanguages();
  }, [fetchLanguages, fetchSubjects, selectedLanguageIdFilter]);

  const deleteSubject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    try {
      await subjectApi.delete(id);
      await fetchSubjects();
      notificationService.success('Subject deleted successfully');
    } catch (error) {
      notificationService.error('Failed to delete subject. Please try again.');
      console.error('Failed to delete subject:', error);
    }
  };

  const saveSubject = async (
    formData: CreateSubjectDto,
    editingSubject: SubjectDto | null,
  ) => {
    try {
      const payload = { ...formData, subjectLanguages: formData.names || [] };

      if (editingSubject) {
        await subjectApi.update(editingSubject.id, payload);
        notificationService.success('Subject updated successfully');
      } else {
        await subjectApi.create(payload);
        notificationService.success('Subject created successfully');
      }

      await fetchSubjects();
      return true;
    } catch (error) {
      notificationService.error('Failed to save subject. Please try again.');
      return false;
    }
  };

  return {
    deleteSubject,
    languages,
    languagesLoading,
    loading,
    saveSubject,
    subjects,
  };
};
