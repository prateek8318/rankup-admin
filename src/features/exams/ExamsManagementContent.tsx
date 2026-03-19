import type { ExamDto } from '@/services';
import DeleteModal from '@/components/common/DeleteModal';
import ExamCard from '@/components/exams/ExamCard';
import Loader from '@/components/common/Loader';
import { formatExamDate, formatExamDuration, useExamsManagement } from '@/features/exams/hooks/useExamsManagement';
import { notificationService } from '@/services/notificationService';
import styles from '@/styles/features/ExamsManagement.module.css';

export const ExamsManagementContent: React.FC = () => {
  const {
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
  } = useExamsManagement();

  const handleExport = () => {
    notificationService.info('Export coming soon', 'Export flow is being aligned with the shared reporting pattern.');
  };

  const handleViewExam = (exam: ExamDto) => {
    notificationService.info('View exam', `Detailed view for "${exam.name}" will be connected next.`);
  };

  const handleEditExam = (exam: ExamDto) => {
    notificationService.info('Edit exam', `Edit flow for "${exam.name}" will be connected next.`);
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Exams Management</h1>
        <p className={styles.pageSubtitle}>
          Create and manage exams, questions, and assessments
        </p>
      </div>

      <div className={styles.cardsRow}>
        {examCards.map((card, index) => (
          <ExamCard
            key={index}
            number={card.number}
            label={card.label}
            gradient={card.gradient}
          />
        ))}
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={styles.pillInput}
          />

          <select
            value={filters.sortBy}
            onChange={(event) => setFilters((previous) => ({ ...previous, sortBy: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="marks">Marks</option>
          </select>

          <select
            value={filters.category}
            onChange={(event) => setFilters((previous) => ({ ...previous, category: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="All Categories">All Categories</option>
            <option value="Mock Test">Mock Test</option>
            <option value="Practice Test">Practice Test</option>
            <option value="Previous Year">Previous Year</option>
          </select>

          <select
            value={filters.course}
            onChange={(event) => setFilters((previous) => ({ ...previous, course: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="">Course</option>
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
            <option value="UPSC">UPSC</option>
          </select>

          <select
            value={filters.examType}
            onChange={(event) => setFilters((previous) => ({ ...previous, examType: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="">Exam Type</option>
            <option value="International">International</option>
            <option value="National">National</option>
          </select>

          <select
            value={filters.status}
            onChange={(event) => setFilters((previous) => ({ ...previous, status: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input
            type="text"
            value={filters.dateRange}
            onChange={(event) => setFilters((previous) => ({ ...previous, dateRange: event.target.value }))}
            placeholder="16 Jan 2026 - 23 Jan 2026"
            className={`${styles.pillInput} ${styles.dateRangeInput}`}
          />

          <select
            value={filters.all}
            onChange={(event) => setFilters((previous) => ({ ...previous, all: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>

          <select
            value={filters.attempt}
            onChange={(event) => setFilters((previous) => ({ ...previous, attempt: event.target.value }))}
            className={styles.pillInput}
          >
            <option value="">Attempt</option>
            <option value="single">Single</option>
            <option value="multiple">Multiple</option>
          </select>

          <button type="button" onClick={handleApply} className={styles.applyButton}>
            Apply
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <button type="button" onClick={handleReset} className={styles.secondaryButton}>
          Reset
        </button>
        <button type="button" onClick={handleExport} className={styles.secondaryButton}>
          Export
        </button>
      </div>

      <div className={styles.tableSection}>
        {loading ? (
          <Loader fullPage={false} message="Loading exams..." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeadCell}>
                    <input
                      type="checkbox"
                      checked={exams.length > 0 && selectedExams.length === exams.length}
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th className={styles.tableHeadCell}>
                    <span className={styles.sortableLabel}>
                      Test Category
                      <span aria-hidden="true">v</span>
                    </span>
                  </th>
                  <th className={styles.tableHeadCell}>Exam Name</th>
                  <th className={styles.tableHeadCell}>Subject</th>
                  <th className={styles.tableHeadCell}>Access</th>
                  <th className={styles.tableHeadCell}>Total Ques.</th>
                  <th className={styles.tableHeadCell}>Difficulty</th>
                  <th className={styles.tableHeadCell}>Total Marks</th>
                  <th className={styles.tableHeadCell}>Exam Date</th>
                  <th className={styles.tableHeadCell}>Duration</th>
                  <th className={styles.tableHeadCell}>Language</th>
                  <th className={styles.tableHeadCell}>
                    <span className={styles.sortableLabel}>
                      Status
                      <span aria-hidden="true">v</span>
                    </span>
                  </th>
                  <th className={styles.tableHeadCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const examId = getExamId(exam);
                  const access = (exam as any).access;

                  return (
                    <tr key={exam.id} className={styles.tableBodyRow}>
                      <td className={styles.tableCell}>
                        <input
                          type="checkbox"
                          checked={selectedExams.includes(examId)}
                          onChange={() => handleSelectExam(examId)}
                          className={styles.checkbox}
                        />
                      </td>
                      <td className={styles.tableCellStrong}>
                        <span className={styles.categoryBadge}>
                          {(exam as any).category || 'NA'}
                        </span>
                      </td>
                      <td className={styles.tableCellStrong}>{exam.name}</td>
                      <td className={styles.tableCell}>{(exam as any).subject || 'NA'}</td>
                      <td className={styles.tableCell}>
                        {access ? (
                          <span className={`${styles.accessDot} ${access === 'Paid' ? styles.accessDotPaid : styles.accessDotFree}`}>
                            {access === 'Paid' ? 'P' : 'F'}
                          </span>
                        ) : 'NA'}
                      </td>
                      <td className={styles.tableCell}>{(exam as any).totalQuestions || 'NA'}</td>
                      <td className={styles.tableCell}>{(exam as any).difficulty || 'NA'}</td>
                      <td className={styles.tableCell}>{exam.totalMarks ?? 'NA'}</td>
                      <td className={styles.tableCell}>{formatExamDate(exam.createdAt)}</td>
                      <td className={styles.tableCell}>{formatExamDuration(exam.durationInMinutes || 0)}</td>
                      <td className={styles.tableCell}>{(exam as any).language || 'English'}</td>
                      <td className={styles.tableCell}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(exam)}
                          className={`${styles.statusToggle} ${exam.isActive ? styles.statusActive : styles.statusInactive}`}
                        >
                          {exam.isActive ? 'Active' : 'Inactive'}
                          <span aria-hidden="true">v</span>
                        </button>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionButtons}>
                          <button type="button" className={styles.linkButton} onClick={() => handleViewExam(exam)}>
                            View
                          </button>
                          <button type="button" className={styles.linkButton} onClick={() => handleEditExam(exam)}>
                            Edit
                          </button>
                          <button type="button" className={styles.dangerLinkButton} onClick={() => handleDeleteRequest(exam)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.pagination}>
          <div className={styles.paginationText}>
            Showing {totalExams === 0 ? 0 : ((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalExams)} of {totalExams} exams
          </div>
          <div className={styles.paginationButtons}>
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : ''}`}
            >
              &lt; Prev
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ''}`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`${styles.pageButton} ${currentPage >= totalPages ? styles.pageButtonDisabled : ''}`}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        open={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        itemName={examToDelete?.name}
        title="Delete Exam"
      />
    </>
  );
};
