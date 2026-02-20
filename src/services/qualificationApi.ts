import { apiClient } from './apiClient';
import { apiEndpoints } from './apiEndpoints';
import {
  QualificationDto,
  CreateQualificationDto,
  UpdateQualificationDto,
  StreamDto,
  CreateStreamDto,
  UpdateStreamDto,
  CountryDto,
  LanguageDto
} from '@/types/qualification';

export const qualificationApi = {
  // Qualification endpoints
  getAllQualifications: async (params?: { languageId?: number; countryCode?: string }): Promise<QualificationDto[]> => {
    const searchParams = new URLSearchParams();
    if (params?.languageId) searchParams.append('languageId', params.languageId.toString());
    if (params?.countryCode) searchParams.append('countryCode', params.countryCode);
    
    const response = await apiClient.get(
      `${apiEndpoints.QUALIFICATIONS.GET_ALL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    );
    return response.data;
  },

  getQualificationById: async (id: string, languageId?: number): Promise<QualificationDto> => {
    const searchParams = languageId ? `?languageId=${languageId}` : '';
    const response = await apiClient.get(`${apiEndpoints.QUALIFICATIONS.GET_BY_ID(id)}${searchParams}`);
    return response.data;
  },

  createQualification: async (data: CreateQualificationDto): Promise<QualificationDto> => {
    const response = await apiClient.post(apiEndpoints.QUALIFICATIONS.CREATE, data);
    return response.data;
  },

  updateQualification: async (id: string, data: UpdateQualificationDto): Promise<QualificationDto> => {
    const response = await apiClient.put(apiEndpoints.QUALIFICATIONS.UPDATE(id), data);
    return response.data;
  },

  deleteQualification: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.QUALIFICATIONS.DELETE(id));
  },

  toggleQualificationStatus: async (id: string, isActive: boolean): Promise<void> => {
    await apiClient.patch(apiEndpoints.QUALIFICATIONS.TOGGLE_STATUS(id), isActive);
  },

  // Stream endpoints
  getAllStreams: async (params?: { languageId?: number; qualificationId?: number }): Promise<StreamDto[]> => {
    const searchParams = new URLSearchParams();
    if (params?.languageId) searchParams.append('languageId', params.languageId.toString());
    if (params?.qualificationId) searchParams.append('qualificationId', params.qualificationId.toString());
    
    const response = await apiClient.get(
      `${apiEndpoints.STREAMS.GET_ALL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    );
    return response.data;
  },

  getStreamById: async (id: string, languageId?: number): Promise<StreamDto> => {
    const searchParams = languageId ? `?languageId=${languageId}` : '';
    const response = await apiClient.get(`${apiEndpoints.STREAMS.GET_BY_ID(id)}${searchParams}`);
    return response.data;
  },

  createStream: async (data: CreateStreamDto): Promise<StreamDto> => {
    const response = await apiClient.post(apiEndpoints.STREAMS.CREATE, data);
    return response.data;
  },

  updateStream: async (id: string, data: UpdateStreamDto): Promise<StreamDto> => {
    const response = await apiClient.put(apiEndpoints.STREAMS.UPDATE(id), data);
    return response.data;
  },

  deleteStream: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.STREAMS.DELETE(id));
  },

  toggleStreamStatus: async (id: string, isActive: boolean): Promise<void> => {
    await apiClient.patch(apiEndpoints.STREAMS.TOGGLE_STATUS(id), isActive);
  },

  getStreamsByQualification: async (qualificationId: string, languageId?: number): Promise<StreamDto[]> => {
    const searchParams = languageId ? `&languageId=${languageId}` : '';
    const response = await apiClient.get(`${apiEndpoints.STREAMS.GET_BY_QUALIFICATION(qualificationId)}${searchParams}`);
    return response.data;
  },
};

// Mock data for countries and languages (in real app, these would come from APIs)
export const mockCountries: CountryDto[] = [
  { id: 1, name: 'India', code: 'IN', isActive: true },
  { id: 2, name: 'United States', code: 'US', isActive: true },
  { id: 3, name: 'United Kingdom', code: 'UK', isActive: true },
  { id: 4, name: 'Canada', code: 'CA', isActive: true },
  { id: 5, name: 'Australia', code: 'AU', isActive: true },
];

export const mockLanguages: LanguageDto[] = [
  { id: 49, name: 'Hindi', code: 'hi', nativeName: 'हिंदी', isActive: true },
  { id: 50, name: 'English', code: 'en', nativeName: 'English', isActive: true },
  { id: 51, name: 'Bengali', code: 'bn', nativeName: 'বাংলা', isActive: true },
  { id: 52, name: 'Tamil', code: 'ta', nativeName: 'தமிழ்', isActive: true },
  { id: 53, name: 'Telugu', code: 'te', nativeName: 'తెలుగు', isActive: true },
  { id: 54, name: 'Marathi', code: 'mr', nativeName: 'मराठी', isActive: true },
  { id: 55, name: 'Gujarati', code: 'gu', nativeName: 'ગુજરાતી', isActive: true },
  { id: 56, name: 'Punjabi', code: 'pa', nativeName: 'ਪੰਜਾਬੀ', isActive: true },
  { id: 57, name: 'Urdu', code: 'ur', nativeName: 'اردو', isActive: true },
  { id: 58, name: 'Malayalam', code: 'ml', nativeName: 'മലയാളം', isActive: true },
  { id: 59, name: 'Kannada', code: 'kn', nativeName: 'ಕನ್ನಡ', isActive: true },
  { id: 60, name: 'Odia', code: 'or', nativeName: 'ଓଡ଼ିଆ', isActive: true },
];

// Auto-translation function (mock implementation - in real app, this would call a translation API)
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Mock translation - in real app, integrate with Google Translate API or similar
  const translations: Record<string, Record<string, string>> = {
    'Bachelor of Technology': {
      'hi': 'बैचलर ऑफ टेक्नोलॉजी',
      'bn': 'ব্যাচেলর অফ টেকনোলজি',
      'ta': 'பேச்சலர் ஆப் டெக்னாலஜி',
      'te': 'బ్యాచిలర్ ఆఫ్ టెక్నాలజీ',
    },
    'Engineering degree program': {
      'hi': 'इंजीनियरिंग डिग्री प्रोग्राम',
      'bn': 'ইঞ্জিনিয়ারিং ডিগ্রি প্রোগ্রাম',
      'ta': 'பொறியியல் பட்டப்படிப்பு திட்டம்',
      'te': 'ఇంజనీరింగ్ డిగ్రీ ప్రోగ్రామ్',
    },
    'Computer Science': {
      'hi': 'कंप्यूटर विज्ञान',
      'bn': 'কম্পিউটার বিজ্ঞান',
      'ta': 'கணினி அறிவியல்',
      'te': 'కంప్యూటర్ సైన్స్',
    },
    'Computer Science and Engineering': {
      'hi': 'कंप्यूटर विज्ञान और इंजीनियरिंग',
      'bn': 'কম্পিউটার বিজ্ঞান এবং ইঞ্জিনিয়ারিং',
      'ta': 'கணினி அறிவியல் மற்றும் பொறியியல்',
      'te': 'కంప్యూటర్ సైన్స్ మరియు ఇంజనీరింగ్',
    },
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return translations[text]?.[targetLanguage] || `[${targetLanguage.toUpperCase()}] ${text}`;
};
