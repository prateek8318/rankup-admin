import type { FormEvent } from 'react';
import Loader from '@/components/common/Loader';
import { CrossIcon } from '@/components/common/CrossIcon';
import { ExamDto, CreateExamDto } from '@/services/examsApi';
import { LanguageDto, QualificationDto, StreamDto } from '@/types/qualification';
import styles from '@/styles/pages/Exams.module.css';

interface ExamFormModalProps {
  isOpen: boolean;
  editingExam: ExamDto | null;
  formData: CreateExamDto;
  qualifications: QualificationDto[];
  streams: StreamDto[];
  languages: LanguageDto[];
  countries: Array<{ code: string; name: string }>;
  languagesLoading: boolean;
  selectedLanguages: number[];
  errors: Record<string, string>;
  imageFile: File | null;
  croppedImage: string | null;
  isInternationalFlag: boolean;
  isTranslating: boolean;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onClose: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldChange: <K extends keyof CreateExamDto>(field: K, value: CreateExamDto[K]) => void;
  onToggleQualification: (qualificationId: number) => void;
  onToggleStream: (streamId: number) => void;
  onLanguageToggle: (languageId: number) => void;
  onInternationalChange: (value: boolean) => void;
}

const ExamFormModal = ({
  isOpen,
  editingExam,
  formData,
  qualifications,
  streams,
  languages,
  countries,
  languagesLoading,
  selectedLanguages,
  errors,
  imageFile,
  croppedImage,
  isInternationalFlag,
  isTranslating,
  onSubmit,
  onClose,
  onImageChange,
  onFieldChange,
  onToggleQualification,
  onToggleStream,
  onLanguageToggle,
  onInternationalChange,
}: ExamFormModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className={styles.modalTitle}>{editingExam ? 'Edit Exam' : 'Add Exam'}</h3>
          <CrossIcon onClick={onClose} />
        </div>

        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          {errors.image && <div className={styles.errorText} style={{ marginBottom: 8 }}>{errors.image}</div>}
          <div
            className={errors.image ? styles.imageUploadBoxError : styles.imageUploadBox}
            onClick={() => document.getElementById('examImageInput')?.click()}
          >
            {croppedImage ? (
              <img src={croppedImage} alt="Cropped" className={styles.imagePreview} />
            ) : imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className={styles.imagePreview} />
            ) : editingExam?.imageUrl ? (
              <img src={editingExam.imageUrl} alt="Current" className={styles.imagePreview} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <div className={styles.imageIcon}>📷</div>
                <div className={styles.helperText}>Upload Image</div>
              </div>
            )}
          </div>
          <input
            id="examImageInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={onImageChange}
            style={{ display: 'none' }}
          />
          <div className={styles.helperText}>Click to upload exam image (PNG, JPG, JPEG only)</div>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name *</label>
            <input
              value={formData.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
              className={errors.name ? styles.formInputError : styles.formInput}
            />
            {errors.name && <div className={styles.errorText}>{errors.name}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description *</label>
            <textarea
              value={formData.description}
              onChange={(event) => onFieldChange('description', event.target.value)}
              rows={3}
              className={errors.description ? styles.formInputError : styles.formInput}
              style={{ resize: 'vertical' }}
            />
            {errors.description && <div className={styles.errorText}>{errors.description}</div>}
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Country *</label>
              <select
                value={formData.countryCode}
                onChange={(event) => onFieldChange('countryCode', event.target.value)}
                className={errors.countryCode ? styles.formInputError : styles.formInput}
                disabled={isInternationalFlag}
              >
                <option value="">Select country</option>
                {countries
                  .filter((country) => !(isInternationalFlag && country.code === 'IN'))
                  .map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
              </select>
              {errors.countryCode && <div className={styles.errorText}>{errors.countryCode}</div>}
            </div>
            <div className={styles.col}>
              <label className={styles.formLabel}>Min Age</label>
              <input
                type="number"
                min="18"
                max="60"
                value={formData.minAge || 18}
                onChange={(event) => {
                  const value = parseInt(event.target.value || '18', 10);
                  if (value >= 18 && value <= 60) {
                    onFieldChange('minAge', value);
                  }
                }}
                className={errors.minAge ? styles.formInputError : styles.formInput}
              />
              {errors.minAge && <div className={styles.errorText}>{errors.minAge}</div>}
            </div>
            <div className={styles.col}>
              <label className={styles.formLabel}>Max Age</label>
              <input
                type="number"
                min="18"
                max="60"
                value={formData.maxAge || 60}
                onChange={(event) => {
                  const value = parseInt(event.target.value || '60', 10);
                  if (value >= 18 && value <= 60) {
                    onFieldChange('maxAge', value);
                  }
                }}
                className={errors.maxAge ? styles.formInputError : styles.formInput}
              />
              {errors.maxAge && <div className={styles.errorText}>{errors.maxAge}</div>}
            </div>
            {errors.ageRange && <div className={styles.errorText} style={{ flex: '1 1 100%' }}>{errors.ageRange}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Qualifications *</label>
            <div className={errors.qualificationIds ? styles.checkboxGroupError : styles.checkboxGroup}>
              {qualifications.map((qualification) => (
                <label key={qualification.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.qualificationIds.includes(qualification.id)}
                    onChange={() => onToggleQualification(qualification.id)}
                    className={styles.checkboxItem}
                  />
                  <span style={{ fontSize: '14px' }}>{qualification.name}</span>
                </label>
              ))}
            </div>
            {errors.qualificationIds && <div className={styles.errorText}>{errors.qualificationIds}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Streams</label>
            <div className={styles.checkboxGroup}>
              {streams.map((stream) => (
                <label key={stream.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.streamIds.includes(stream.id)}
                    onChange={() => onToggleStream(stream.id)}
                    className={styles.checkboxItem}
                  />
                  <span style={{ fontSize: '14px' }}>{stream.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Select Languages *</label>
            {languagesLoading ? (
              <Loader fullPage={false} message="Loading languages..." />
            ) : (
              <div className={styles.checkboxGroup} style={{ maxHeight: '120px' }}>
                {languages.map((language) => (
                  <label key={language.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language.id)}
                      onChange={() => onLanguageToggle(language.id)}
                      disabled={isTranslating}
                      className={styles.checkboxItem}
                    />
                    <span style={{ fontSize: '14px' }}>
                      {language.name} ({language.code})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {(formData.names || []).length > 0 && (
            <div className={styles.translationBox}>
              <h4 className={styles.translationBoxTitle}>Translated Content:</h4>
              {(formData.names || []).map((name, index) => {
                const language = languages.find((entry) => entry.id === name.languageId);

                return (
                  <div key={`${name.languageId}-${index}`} className={styles.translationItem}>
                    <p className={styles.translationLang}>
                      {language?.name} ({language?.code})
                    </p>
                    <p className={styles.translationText}>
                      <strong>Name:</strong> {name.name}
                    </p>
                    <p className={styles.translationText}>
                      <strong>Description:</strong> {name.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isInternationalFlag}
                disabled={formData.countryCode === 'IN'}
                onChange={(event) => onInternationalChange(event.target.checked)}
                className={styles.checkboxItem}
              />
              <span style={{ fontSize: '14px' }}>International Exam</span>
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.secondaryButton}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTranslating}
              className={`${styles.primaryButton} ${isTranslating ? styles.primaryButtonDisabled : ''}`}
            >
              {isTranslating ? 'Translating...' : editingExam ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormModal;
