import { CreateExamDto, ExamDto } from '@/services/examsApi';

export type RegionFilter = 'all' | 'india' | 'international';

export const createInitialExamFormData = (): CreateExamDto => ({
  name: '',
  description: '',
  countryCode: 'IN',
  minAge: 18,
  maxAge: 60,
  names: [],
  qualificationIds: [],
  streamIds: [],
});

export const filterExams = (
  exams: ExamDto[],
  searchTerm: string,
  regionFilter: RegionFilter,
) => {
  const normalizedSearch = searchTerm.toLowerCase();

  return exams.filter((exam) => {
    const matchesSearch = (exam.name || '').toLowerCase().includes(normalizedSearch)
      || (exam.description || '').toLowerCase().includes(normalizedSearch);
    const matchesRegion = regionFilter === 'all'
      || (regionFilter === 'india' && exam.countryCode === 'IN')
      || (regionFilter === 'international' && exam.countryCode !== 'IN');

    return matchesSearch && matchesRegion;
  });
};

export const validateExamForm = (
  formData: CreateExamDto,
  isInternationalFlag: boolean,
) => {
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

  if (!formData.qualificationIds?.length) {
    errors.qualificationIds = 'At least one qualification is required';
  }

  if (formData.minAge < 18) {
    errors.minAge = 'Minimum age must be at least 18';
  }

  if (formData.maxAge > 60) {
    errors.maxAge = 'Maximum age cannot exceed 60';
  }

  if (
    formData.minAge >= 18
    && formData.maxAge >= 18
    && formData.minAge > formData.maxAge
  ) {
    errors.ageRange = 'Minimum age cannot be greater than maximum age';
  }

  return errors;
};

export const validateExamImage = (file: File) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    return 'Only PNG, JPG, and JPEG formats are allowed';
  }

  if (file.size > 5 * 1024 * 1024) {
    return 'Image size should be less than 5MB';
  }

  return null;
};

export const getExamImageSource = (exam: ExamDto) => {
  const source = (exam as any).imageUrl
    || (exam as any).image
    || (exam as any).logo
    || (exam as any).imagePath
    || '';

  if (!source) {
    return '';
  }

  if (typeof window !== 'undefined' && source.startsWith('/')) {
    return `${window.location.origin}${source}`;
  }

  return source;
};
