import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import { qualificationApi } from '@/services/qualificationApi';
import { languageApi, streamApi } from '@/services/masterApi';
import { getUserFriendlyErrorMessage } from '@/services/errorHandlingService';
import { StreamDto, QualificationDto, LanguageDto, CreateStreamDto } from '@/types/qualification';
import { extractApiData } from '@/utils/apiHelpers';
import { useMasterDataStore } from '@/context/MasterDataContext';

export const useStreams = (selectedLanguageFilter?: string) => {
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [qualifications, setQualifications] = useState<QualificationDto[]>([]);
  const [languages, setLanguages] = useState<LanguageDto[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const { featureState, dispatch } = useMasterDataStore('streams');

  const fetchData = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_START', feature: 'streams' });
      const params: any = {};
      if (selectedLanguageFilter) params.language = selectedLanguageFilter;
      const [streamsData, qualificationsData] = await Promise.all([
        qualificationApi.getAllStreams(params),
        qualificationApi.getAllQualifications(params),
      ]);
      setStreams(streamsData);
      setQualifications(qualificationsData);
      dispatch({ type: 'FETCH_SUCCESS', feature: 'streams' });
    } catch (error) {
      dispatch({
        type: 'REQUEST_ERROR',
        feature: 'streams',
        message: getUserFriendlyErrorMessage(error),
      });
    }
  }, [dispatch, selectedLanguageFilter]);

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
    void fetchData();
    void fetchLanguages();
  }, [fetchData, fetchLanguages]);

  const requestDeleteStream = (stream: StreamDto) => {
    dispatch({
      type: 'SET_PENDING_DELETE',
      feature: 'streams',
      id: stream.id,
      label: stream.name,
    });
  };

  const cancelDeleteStream = () => {
    dispatch({ type: 'RESET_DELETE_STATE', feature: 'streams' });
  };

  const confirmDeleteStream = async () => {
    if (!featureState.pendingDeleteId) {
      return;
    }

    try {
      dispatch({
        type: 'DELETE_START',
        feature: 'streams',
        id: featureState.pendingDeleteId,
      });
      await streamApi.delete(featureState.pendingDeleteId);
      notificationService.success('Stream deleted successfully');
      await fetchData();
      dispatch({
        type: 'DELETE_SUCCESS',
        feature: 'streams',
        message: 'Stream deleted successfully',
      });
    } catch (error) {
      dispatch({
        type: 'REQUEST_ERROR',
        feature: 'streams',
        message: getUserFriendlyErrorMessage(error),
      });
    }
  };

  const saveStream = async (formData: CreateStreamDto, editingStream: StreamDto | null) => {
    try {
      dispatch({ type: 'SAVE_START', feature: 'streams' });
      if (editingStream) {
        await streamApi.update(editingStream.id, {
          ...formData, id: editingStream.id,
        });
        dispatch({
          type: 'SAVE_SUCCESS',
          feature: 'streams',
          message: 'Stream updated successfully',
        });
        notificationService.success('Stream updated successfully');
      } else {
        await streamApi.create(formData);
        dispatch({
          type: 'SAVE_SUCCESS',
          feature: 'streams',
          message: 'Stream created successfully',
        });
        notificationService.success('Stream created successfully');
      }
      await fetchData();
      return true;
    } catch (error) {
      dispatch({
        type: 'REQUEST_ERROR',
        feature: 'streams',
        message: getUserFriendlyErrorMessage(error),
      });
      return false;
    }
  };

  const clearSuccessMessage = () => {
    dispatch({ type: 'CLEAR_SUCCESS', feature: 'streams' });
  };

  return {
    streams,
    qualifications,
    languages,
    loading: featureState.loading,
    languagesLoading,
    requestDeleteStream,
    confirmDeleteStream,
    cancelDeleteStream,
    pendingDeleteId: featureState.pendingDeleteId,
    pendingDeleteLabel: featureState.pendingDeleteLabel,
    deletingId: featureState.deletingId,
    saving: featureState.saving,
    error: featureState.error,
    successMessage: featureState.successMessage,
    clearSuccessMessage,
    saveStream,
  };
};
