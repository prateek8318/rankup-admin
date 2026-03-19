import { useApi } from '@/hooks/useApi';
import { ExamDto, CreateExamDto, UpdateExamDto, getExamsList, createExam, updateExam, updateExamStatus, uploadExamImage } from '@/services/examsApi';
import { qualificationApi, streamApi, languageApi, countryApi } from '@/services/masterApi';
import { QualificationDto, StreamDto, LanguageDto } from '@/types/qualification';
import { notificationService } from '@/services/notificationService';
import { errorHandlingService } from '@/services/errorHandlingService';

export class ExamDataService {
  static async fetchExams(): Promise<ExamDto[]> {
    try {
      const resp = await getExamsList({ page: 1, limit: 1000 });
      if (resp?.success && resp.data) {
        return resp.data;
      }
      return [];
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchExams');
      return [];
    }
  }

  static async fetchQualifications(): Promise<QualificationDto[]> {
    try {
      const qualsResp = await qualificationApi.getAll();
      return Array.isArray(qualsResp.data) ? qualsResp.data : (qualsResp.data?.data || []);
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchQualifications');
      return [];
    }
  }

  static async fetchStreams(): Promise<StreamDto[]> {
    try {
      const streamsResp = await streamApi.getAll();
      return Array.isArray(streamsResp.data) ? streamsResp.data : (streamsResp.data?.data || []);
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchStreams');
      return [];
    }
  }

  static async fetchLanguages(): Promise<LanguageDto[]> {
    try {
      const response = await languageApi.getAll();
      if (response.data) {
        if (response.data.success && response.data.data) return response.data.data;
        else if (Array.isArray(response.data)) return response.data;
        else if (response.data.data && Array.isArray(response.data.data)) return response.data.data;
      } else if (response && Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchLanguages');
      return [];
    }
  }

  static async fetchCountries(): Promise<any[]> {
    try {
      const res = await countryApi.getAll();
      if (res?.data?.data) return res.data.data;
      else if (Array.isArray(res.data)) return res.data;
      return [];
    } catch (error) {
      errorHandlingService.handleError(error, 'fetchCountries');
      return [];
    }
  }

  static async createExam(examData: CreateExamDto): Promise<ExamDto | null> {
    try {
      const result = await createExam(examData);
      notificationService.success('Exam created successfully');
      return result.data;
    } catch (error) {
      errorHandlingService.handleError(error, 'createExam');
      return null;
    }
  }

  static async updateExam(examData: UpdateExamDto): Promise<ExamDto | null> {
    try {
      const result = await updateExam(examData.id, examData);
      notificationService.success('Exam updated successfully');
      return result.data;
    } catch (error) {
      errorHandlingService.handleError(error, 'updateExam');
      return null;
    }
  }

  static async deleteExam(id: number): Promise<boolean> {
    try {
      await updateExamStatus(id, false);
      notificationService.success('Exam deactivated successfully');
      return true;
    } catch (error) {
      errorHandlingService.handleError(error, 'deleteExam');
      return false;
    }
  }

  static async uploadExamImage(file: File): Promise<string | null> {
    try {
      const result = await uploadExamImage(0, file); // fallback to 0 or expect ID
      return result.imageUrl;
    } catch (error) {
      errorHandlingService.handleError(error, 'uploadExamImage');
      return null;
    }
  }
}

export const useExamData = () => {
  const examsApi = useApi(ExamDataService.fetchExams, { showToast: false });
  const qualificationsApi = useApi(ExamDataService.fetchQualifications, { showToast: false });
  const streamsApi = useApi(ExamDataService.fetchStreams, { showToast: false });
  const languagesApi = useApi(ExamDataService.fetchLanguages, { showToast: false });
  const countriesApi = useApi(ExamDataService.fetchCountries, { showToast: false });

  const loading = examsApi.loading || qualificationsApi.loading || 
                 streamsApi.loading || languagesApi.loading || countriesApi.loading;

  const refetchAll = () => {
    examsApi.refetch();
    qualificationsApi.refetch();
    streamsApi.refetch();
    languagesApi.refetch();
    countriesApi.refetch();
  };

  return {
    exams: examsApi.data || [],
    qualifications: qualificationsApi.data || [],
    streams: streamsApi.data || [],
    languages: languagesApi.data || [],
    countries: countriesApi.data || [],
    loading,
    refetchAll
  };
};
