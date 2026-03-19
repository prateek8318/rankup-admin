import { useMemo, useState } from 'react';
import { useExams } from '@/hooks/useExams';
import ExamCropModal from '@/features/master/exams/components/ExamCropModal';
import ExamFormModal from '@/features/master/exams/components/ExamFormModal';
import ExamTable from '@/features/master/exams/ExamTable';
import { useExamForm } from '@/features/master/exams/hooks/useExamForm';
import { filterExams, type RegionFilter } from '@/features/master/exams/examUtils';
import styles from '@/styles/pages/Exams.module.css';
import Loader from '@/components/common/Loader';

const Exams = () => {
  const {
    exams,
    qualifications,
    streams,
    languages,
    countries,
    loading,
    languagesLoading,
    removeExam,
    saveExam,
  } = useExams();

  const [filterLanguageId, setFilterLanguageId] = useState<number | null>(null);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    crop,
    croppedImage,
    errors,
    formData,
    handleCropCancel,
    handleCropConfirm,
    handleDeleteClose,
    handleImageChange,
    handleLanguageToggle,
    handleSubmit,
    imageFile,
    isInternationalFlag,
    isTranslating,
    openCreateModal,
    openEditModal,
    setCrop,
    setCroppedAreaPixels,
    setFormData,
    setIsInternationalFlag,
    selectedLanguages,
    setZoom,
    showCropModal,
    showModal,
    zoom,
    editingExam,
  } = useExamForm({ languages, saveExam });

  const filteredExamRows = useMemo(
    () => filterExams(exams, searchTerm, regionFilter),
    [exams, regionFilter, searchTerm],
  );

  return (
    <>
      {loading && <Loader message="Loading exams..." />}
      
      <div className={styles.headerContainer}>
        <div className={styles.filtersRow}>
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={styles.searchInput}
          />
          <select
            value={filterLanguageId ?? ''}
            onChange={(event) => setFilterLanguageId(event.target.value ? parseInt(event.target.value, 10) : null)}
            className={styles.filterSelect}
          >
            <option value="">All languages</option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name} ({language.code})
              </option>
            ))}
          </select>
          <select
            value={regionFilter}
            onChange={(event) => setRegionFilter(event.target.value as RegionFilter)}
            className={styles.filterSelect}
          >
            <option value="all">All regions</option>
            <option value="india">India</option>
            <option value="international">International</option>
          </select>
        </div>
        <button onClick={openCreateModal} className={styles.primaryButton}>
          Add Exam
        </button>
      </div>

      <ExamTable
        exams={filteredExamRows}
        languages={languages}
        loading={false}
        onEdit={openEditModal}
        onDelete={removeExam}
      />

      <ExamFormModal
        isOpen={showModal}
        editingExam={editingExam}
        formData={formData}
        qualifications={qualifications}
        streams={streams}
        languages={languages}
        countries={countries}
        languagesLoading={languagesLoading}
        selectedLanguages={selectedLanguages}
        errors={errors}
        imageFile={imageFile}
        croppedImage={croppedImage}
        isInternationalFlag={isInternationalFlag}
        isTranslating={isTranslating}
        onSubmit={handleSubmit}
        onClose={handleDeleteClose}
        onImageChange={handleImageChange}
        onFieldChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
        onToggleQualification={(qualificationId) => setFormData((prev) => ({
          ...prev,
          qualificationIds: prev.qualificationIds.includes(qualificationId)
            ? prev.qualificationIds.filter((id) => id !== qualificationId)
            : [...prev.qualificationIds, qualificationId],
        }))}
        onToggleStream={(streamId) => setFormData((prev) => ({
          ...prev,
          streamIds: prev.streamIds.includes(streamId)
            ? prev.streamIds.filter((id) => id !== streamId)
            : [...prev.streamIds, streamId],
        }))}
        onLanguageToggle={handleLanguageToggle}
        onInternationalChange={setIsInternationalFlag}
      />

      <ExamCropModal
        imageFile={imageFile}
        isOpen={showCropModal}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
        onZoomChange={setZoom}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </>
  );
};

export default Exams;
