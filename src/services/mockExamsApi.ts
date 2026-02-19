import { type ExamDto, type CreateExamDto, type UpdateExamDto, type ExamListParams, type ApiResponse } from './examsApi';

// Mock data for testing
const mockExams: ExamDto[] = [
  {
    id: 1,
    name: "Mathematics Final Exam",
    description: "Comprehensive mathematics exam covering all topics",
    durationInMinutes: 120,
    totalMarks: 100,
    passingMarks: 35,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    imageUrl: "https://example.com/math-exam.jpg",
    isInternational: false,
    qualificationIds: [1, 2],
    streamIds: [1]
  },
  {
    id: 2,
    name: "Science Assessment",
    description: "Physics, Chemistry and Biology combined test",
    durationInMinutes: 90,
    totalMarks: 80,
    passingMarks: 28,
    isActive: true,
    createdAt: "2024-01-20T14:15:00Z",
    imageUrl: "https://example.com/science-exam.jpg",
    isInternational: false,
    qualificationIds: [2],
    streamIds: [2]
  },
  {
    id: 3,
    name: "English Language Test",
    description: "Grammar, vocabulary and comprehension test",
    durationInMinutes: 60,
    totalMarks: 50,
    passingMarks: 20,
    isActive: false,
    createdAt: "2024-01-25T09:00:00Z",
    imageUrl: "https://example.com/english-exam.jpg",
    isInternational: true,
    qualificationIds: [1, 3],
    streamIds: [1, 3]
  }
];

/**
 * Mock API functions for testing when backend is not available
 */
export const mockExamsApi = {
  getExamsList: async (params: ExamListParams = {}): Promise<ApiResponse<ExamDto[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredExams = [...mockExams];
    
    // Apply filters
    if (params.isInternational !== undefined) {
      filteredExams = filteredExams.filter(exam => exam.isInternational === params.isInternational);
    }
    
    if (params.qualificationId) {
      filteredExams = filteredExams.filter(exam => exam.qualificationIds.includes(params.qualificationId!));
    }
    
    if (params.streamId) {
      filteredExams = filteredExams.filter(exam => exam.streamIds.includes(params.streamId!));
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredExams = filteredExams.filter(exam => 
        exam.name.toLowerCase().includes(searchLower) ||
        exam.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedExams = filteredExams.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedExams,
      totalCount: filteredExams.length
    };
  },

  getExamById: async (id: number): Promise<ApiResponse<ExamDto>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const exam = mockExams.find(e => e.id === id);
    if (!exam) {
      throw new Error('Exam not found');
    }
    
    return {
      success: true,
      data: exam
    };
  },

  createExam: async (examData: CreateExamDto): Promise<ApiResponse<ExamDto>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newExam: ExamDto = {
      id: Math.max(...mockExams.map(e => e.id)) + 1,
      ...examData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    mockExams.push(newExam);
    
    return {
      success: true,
      data: newExam
    };
  },

  updateExam: async (id: number, examData: UpdateExamDto): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockExams.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Exam not found');
    }
    
    mockExams[index] = { ...mockExams[index], ...examData };
  },

  deleteExam: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockExams.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Exam not found');
    }
    
    mockExams.splice(index, 1);
  },

  updateExamStatus: async (id: number, isActive: boolean): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const exam = mockExams.find(e => e.id === id);
    if (!exam) {
      throw new Error('Exam not found');
    }
    
    exam.isActive = isActive;
  },

  uploadExamImage: async (id: number, file: File): Promise<{ imageUrl: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      imageUrl: `https://example.com/uploads/exam-${id}-${file.name}`
    };
  },

  getExamsByQualification: async (qualificationId: number, streamId?: number): Promise<ApiResponse<ExamDto[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredExams = mockExams.filter(exam => exam.qualificationIds.includes(qualificationId));
    
    if (streamId) {
      filteredExams = filteredExams.filter(exam => exam.streamIds.includes(streamId));
    }
    
    return {
      success: true,
      data: filteredExams
    };
  },

  getExamsForUser: async (): Promise<ApiResponse<ExamDto[]>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const activeExams = mockExams.filter(exam => exam.isActive);
    
    return {
      success: true,
      data: activeExams
    };
  },

  // Legacy functions
  getExams: async (params: ExamListParams = {}) => mockExamsApi.getExamsList(params),
  getExamsCount: async (): Promise<ApiResponse<{ totalExams: number }>> => {
    const result = await mockExamsApi.getExamsList({ limit: 1 });
    return {
      success: true,
      data: { totalExams: result.totalCount || mockExams.length }
    };
  }
};

export default mockExamsApi;
