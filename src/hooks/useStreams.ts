import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { qualificationApi } from '@/services/qualificationApi';
import { languageApi, streamApi } from '@/services/masterApi';
import { StreamDto, QualificationDto, LanguageDto, CreateStreamDto } from '@/types/qualification';
import { extractApiData } from '@/utils/apiHelpers';

export const useStreams = (selectedLanguageFilter?: string) => {
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedLanguageFilter) params.language = selectedLanguageFilter;
      const [streamsData, qualificationsData] = await Promise.all([
        qualificationApi.getAllStreams(params),
        qualificationApi.getAllQualifications(params),
      ]);
      setStreams(streamsData);
      setQualifications(qualificationsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedLanguageFilter]);

  const fetchLanguages = useCallback(async () => {
    try {
      setLanguagesLoading(true);
      const response = await languageApi.getAll();
      setLanguages(extractApiData<LanguageDto>(response));
    } catch (error) {
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchLanguages();
  }, [fetchData, fetchLanguages]);

  const deleteStream = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      try {
        await streamApi.delete(id);
        toast.success('Stream deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete stream');
      }
    }
  };

  const saveStream = async (formData: CreateStreamDto, editingStream: StreamDto | null) => {
    try {
      if (editingStream) {
        await streamApi.update(editingStream.id, {
          ...formData, id: editingStream.id,
        });
        toast.success('Stream updated successfully');
      } else {
        await streamApi.create(formData);
        toast.success('Stream created successfully');
      }
      fetchData();
      return true;
    } catch (error) {
      toast.error('Failed to save stream');
      return false;
    }
  };

  return {
    streams,
    qualifications,
    languages,
    loading,
    languagesLoading,
    deleteStream,
    saveStream,
  };
};
