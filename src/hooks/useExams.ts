import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import { getExamsList, createExam, updateExam, updateExamStatus, uploadExamImage, ExamDto } from '@/services/examsApi';
import { qualificationApi, streamApi, languageApi, countryApi, examApi } from '@/services/masterApi';
import { QualificationDto, StreamDto, LanguageDto } from '@/types/qualification';

export const useExams = () => {
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await getExamsList({ page: 1, limit: 1000 });
      if (resp?.success && resp.data) setExams(resp.data);

      const qualsResp = await qualificationApi.getAll();
      setQualifications(Array.isArray(qualsResp.data) ? qualsResp.data : (qualsResp.data?.data || []));
      const streamsResp = await streamApi.getAll();
      setStreams(Array.isArray(streamsResp.data) ? streamsResp.data : (streamsResp.data?.data || []));
    } catch (err) {
      notificationService.error('Failed to fetch exams data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      if (response.data) {
        if (response.data.success && response.data.data) setLanguages(response.data.data);
        else if (Array.isArray(response.data)) setLanguages(response.data);
        else if (response.data.data && Array.isArray(response.data.data)) setLanguages(response.data.data);
        else setLanguages([]);
      } else if (response && Array.isArray(response)) {
        setLanguages(response);
      } else {
        setLanguages([]);
      }
    } catch (err) {
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await countryApi.getAll();
      if (res?.data?.data) setCountries(res.data.data);
      else if (Array.isArray(res.data)) setCountries(res.data);
      else setCountries([]);
    } catch (err) {
      setCountries([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchLanguages();
    fetchCountries();
  }, [fetchData, fetchLanguages, fetchCountries]);

  const removeExam = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    try {
      await examApi.delete(id);
      notificationService.success('Exam deleted successfully');
      await fetchData();
    } catch (err) {
      notificationService.error('Failed to delete exam');
    }
  };

  const saveExam = async (formData: any, editingExam: ExamDto | null, imageFile: File | null, isInternationalFlag: boolean) => {
    try {
      if (editingExam) {
        const payload = { id: editingExam.id, ...formData };
        if (isInternationalFlag) payload.isInternational = true;
        await updateExam(editingExam.id, payload);
        if (imageFile) {
          const up = await uploadExamImage(editingExam.id, imageFile);
          if (up && (up as any).imageUrl) formData.imageUrl = (up as any).imageUrl;
        }
        notificationService.success('Exam updated successfully');
      } else {
        const createPayload = { ...formData };
        if (isInternationalFlag) createPayload.isInternational = true;
        const resp = await createExam(createPayload);
        const createdId = resp?.data?.id || (resp?.data as any)?.examId || (resp?.data && (resp.data as any).id);
        if (imageFile && createdId) {
          const up = await uploadExamImage(createdId, imageFile);
          if (up && (up as any).imageUrl) formData.imageUrl = (up as any).imageUrl;
        }
        notificationService.success('Exam created successfully');
      }
      await fetchData();
      return true;
    } catch (err) {
      notificationService.error('Failed to save exam');
      return false;
    }
  };

  return {
    exams,
    qualifications,
    streams,
    languages,
    countries,
    loading,
    languagesLoading,
    removeExam,
    saveExam,
  };
};
