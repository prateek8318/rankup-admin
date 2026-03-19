import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteExam, getExamsCount, getExamsList, updateExamStatus, type ExamDto } from '@/services/examsApi';
import { getUserFriendlyErrorMessage, logError } from '@/services/errorHandlingService';
import { notificationService } from '@/services/notificationService';

const EXAMS_PER_PAGE = 10;

type FiltersState = {
  sortBy: string;
  category: string;
  course: string;
  examType: string;
  status: string;
  dateRange: string;
  all: string;
  attempt: string;
};

const createDefaultFilters = (): FiltersState => ({
  sortBy: '',
  category: 'All Categories',
  course: '',
  examType: '',
  status: '',
  dateRange: '',
  all: '',
  attempt: '',
});

const buildExamStats = (items: ExamDto[], totalCount: number) => ({
  totalExams: totalCount,
  activeExams: items.filter((exam) => exam.isActive).length,
  inactiveExams: items.filter((exam) => !exam.isActive).length,
  totalQuestions: items.reduce((sum, exam) => sum + (exam.totalMarks || 0), 0),
  avgDuration: items.length > 0
    ? Math.round(items.reduce((sum, exam) => sum + (exam.durationInMinutes || 0), 0) / items.length)
    : 0,
});

const matchesFilters = (exam: ExamDto, filters: FiltersState) => {
  const typedExam = exam as any;
  const category = (typedExam.category || '').toString().toLowerCase();
  const course = (typedExam.course || '').toString().toLowerCase();
  const access = (typedExam.access || '').toString().toLowerCase();
  const attempt = (typedExam.attempt || '').toString().toLowerCase();
  const examType = (typedExam.examType || (typedExam.isInternational ? 'international' : 'national')).toString().toLowerCase();
  const status = exam.isActive ? 'active' : 'inactive';

  if (filters.category && filters.category !== 'All Categories' && category !== filters.category.toLowerCase()) {
    return false;
  }

  if (filters.course && course !== filters.course.toLowerCase()) {
    return false;
  }

  if (filters.examType && examType !== filters.examType.toLowerCase()) {
    return false;
  }

  if (filters.status && status !== filters.status.toLowerCase()) {
    return false;
  }

  if (filters.all && access !== filters.all.toLowerCase()) {
    return false;
  }

  if (filters.attempt && attempt !== filters.attempt.toLowerCase()) {
    return false;
  }

  return true;
};

const hasActiveFilters = (filters: FiltersState) => (
  Boolean(
    filters.sortBy ||
    (filters.category && filters.category !== 'All Categories') ||
    filters.course ||
    filters.examType ||
    filters.status ||
    filters.dateRange ||
    filters.all ||
    filters.attempt
  )
);

export const useExamsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [filters, setFilters] = useState<FiltersState>(createDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalExams, setTotalExams] = useState(0);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(buildExamStats([], 0));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<ExamDto | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getExamsList({
        page: currentPage,
        limit: EXAMS_PER_PAGE,
        search: searchTerm,
      });

      if (!response.success || !response.data) {
        setExams([]);
        setStats(buildExamStats([], 0));
        return;
      }

      const filteredExams = response.data.filter((exam) => matchesFilters(exam, filters));
      const nextTotal = hasActiveFilters(filters)
        ? filteredExams.length
        : (response.totalCount ?? filteredExams.length);
      setExams(filteredExams);
      setTotalExams(nextTotal);
      setStats(buildExamStats(filteredExams, nextTotal));
    } catch (error) {
      logError(error, 'fetch exams list');
      setExams([]);
      setStats(buildExamStats([], 0));
      notificationService.error(
        'Unable to load exams',
        getUserFriendlyErrorMessage(error, 'We could not load the exams list right now.'),
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchTerm]);

  const fetchTotalExamsCount = useCallback(async () => {
    try {
      const response = await getExamsCount();
      if (response.success && response.data) {
        setTotalExams(response.data.totalExams || 0);
      }
    } catch (error) {
      logError(error, 'fetch exams count');
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    fetchTotalExamsCount();
  }, [fetchTotalExamsCount]);

  const examCards = useMemo(
    () => [
      { number: stats.totalExams.toLocaleString(), label: 'Total Exams', gradient: 'linear-gradient(135deg,#4780CF,#2B6AEC)' },
      { number: stats.activeExams.toLocaleString(), label: 'Active Exams', gradient: 'linear-gradient(135deg,#FF8C42,#FF6B1A)' },
      { number: stats.inactiveExams.toLocaleString(), label: 'Inactive Exams', gradient: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
      { number: stats.totalQuestions.toLocaleString(), label: 'Total Questions', gradient: 'linear-gradient(135deg,#EC4899,#DB2777)' },
      { number: `${stats.avgDuration} min`, label: 'Avg Duration', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
    ],
    [stats],
  );

  const totalPages = Math.max(1, Math.ceil(totalExams / EXAMS_PER_PAGE));

  const visiblePages = useMemo(() => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const getExamId = useCallback((exam: ExamDto) => `EXM${String(exam.id).padStart(3, '0')}`, []);

  const handleSelectExam = useCallback((examId: string) => {
    setSelectedExams((previous) => (
      previous.includes(examId)
        ? previous.filter((id) => id !== examId)
        : [...previous, examId]
    ));
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedExams((previous) => (
      previous.length === exams.length ? [] : exams.map(getExamId)
    ));
  }, [exams, getExamId]);

  const handleApply = useCallback(() => {
    setCurrentPage(1);
    fetchExams();
  }, [fetchExams]);

  const handleReset = useCallback(() => {
    setFilters(createDefaultFilters());
    setSearchTerm('');
    setSelectedExams([]);
    setCurrentPage(1);
  }, []);

  const handleDeleteRequest = useCallback((exam: ExamDto) => {
    setExamToDelete(exam);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
    setExamToDelete(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!examToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteExam(examToDelete.id);
      notificationService.success('Exam deleted', `"${examToDelete.name}" was removed successfully.`);
      handleDeleteCancel();
      await fetchExams();
      await fetchTotalExamsCount();
    } catch (error) {
      logError(error, `delete exam ${examToDelete.id}`);
      notificationService.error(
        'Delete failed',
        getUserFriendlyErrorMessage(error, 'We could not delete this exam. Please try again.'),
      );
    } finally {
      setDeleteLoading(false);
    }
  }, [examToDelete, fetchExams, fetchTotalExamsCount, handleDeleteCancel]);

  const handleToggleStatus = useCallback(async (exam: ExamDto) => {
    try {
      await updateExamStatus(exam.id, !exam.isActive);
      notificationService.success(
        'Exam updated',
        `"${exam.name}" is now ${exam.isActive ? 'inactive' : 'active'}.`,
      );
      await fetchExams();
      await fetchTotalExamsCount();
    } catch (error) {
      logError(error, `toggle exam status ${exam.id}`);
      notificationService.error(
        'Status update failed',
        getUserFriendlyErrorMessage(error, 'We could not update the exam status. Please try again.'),
      );
    }
  }, [fetchExams, fetchTotalExamsCount]);

  return {
    currentPage,
    deleteLoading,
    examCards,
    examToDelete,
    exams,
    filters,
    getExamId,
    handleApply,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleDeleteRequest,
    handleReset,
    handleSelectAll,
    handleSelectExam,
    handleToggleStatus,
    isDeleteModalOpen,
    loading,
    searchTerm,
    selectedExams,
    setCurrentPage,
    setFilters,
    setSearchTerm,
    totalExams,
    totalPages,
    visiblePages,
  };
};

export const formatExamDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatExamDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}h ${mins}m`;
};
