import { useCallback, useEffect, useState } from 'react';
import {
  languageApi,
  LanguageDto,
  subjectApi,
  SubjectDto,
  CreateSubjectDto,
} from '@/services/masterApi';

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
    if (!window.confirm('Disable this subject?')) {
      return;
    }

    try {
      await subjectApi.updateStatus(id, false);
      await fetchSubjects();
    } catch (error) {
      ;
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
      } else {
        await subjectApi.create(payload);
      }

      await fetchSubjects();
      return true;
    } catch (error) {
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
