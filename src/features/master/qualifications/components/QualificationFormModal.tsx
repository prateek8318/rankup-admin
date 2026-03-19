import type { FormEvent } from 'react';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormTextarea from '@/components/common/FormTextarea';
import LanguageChecklistPicker from '@/components/common/LanguageChecklistPicker';
import MasterModal from '@/components/common/MasterModal';
import NameDescriptionTranslationFields from '@/features/master/shared/components/NameDescriptionTranslationFields';
import { CreateQualificationDto, LanguageDto, QualificationDto } from '@/types/qualification';
import styles from '@/styles/pages/Qualifications.module.css';

interface QualificationFormModalProps {
  isOpen: boolean;
  editingQualification: QualificationDto | null;
  formData: CreateQualificationDto;
  errors: Record<string, string>;
  countries: Array<{ code: string; name: string }>;
  languages: LanguageDto[];
  selectedLanguages: number[];
  languagesLoading: boolean;
  autoTranslate: boolean;
  isTranslating: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onLanguageToggle: (languageId: number) => void;
  onAutoTranslateChange: (value: boolean) => void;
  onTranslationChange: (
    languageId: number,
    field: 'name' | 'description',
    value: string,
  ) => void;
}

const QualificationFormModal = ({
  isOpen,
  editingQualification,
  formData,
  errors,
  countries,
  languages,
  selectedLanguages,
  languagesLoading,
  autoTranslate,
  isTranslating,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
  onCountryChange,
  onLanguageToggle,
  onAutoTranslateChange,
  onTranslationChange,
}: QualificationFormModalProps) => (
  <MasterModal
    isOpen={isOpen}
    title={editingQualification ? 'Edit Qualification' : 'Add Qualification'}
    width={600}
  >
    <form onSubmit={onSubmit}>
      <FormInput
        label="Name"
        value={formData.name}
        onChange={onNameChange}
        required
        labelSuffix={isTranslating ? (
          <span className={styles.translatingText}>(Translating...)</span>
        ) : null}
        error={errors.name}
      />

      <FormTextarea
        label="Description"
        value={formData.description}
        onChange={onDescriptionChange}
        required
        error={errors.description}
      />

      <FormSelect
        label="Select Country"
        value={formData.countryCode}
        onChange={onCountryChange}
        options={countries.map((country) => ({
          value: country.code,
          label: `${country.name} (${country.code})`,
        }))}
        required
        placeholder="Choose a country..."
        error={errors.countryCode}
      />

      <LanguageChecklistPicker
        label="Select Languages *"
        languages={languages}
        selectedLanguageIds={selectedLanguages}
        onToggle={onLanguageToggle}
        loading={languagesLoading}
        disabled={isTranslating}
        showAutoTranslate
        autoTranslate={autoTranslate}
        onAutoTranslateChange={onAutoTranslateChange}
        helperText="Select multiple languages for qualification name and description translations."
      />
      {errors.languages && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
          {errors.languages}
        </div>
      )}

      <NameDescriptionTranslationFields
        label="Qualification Names and Descriptions by Language *"
        languages={languages}
        items={formData.names}
        classNames={{
          section: styles.translationSection,
          label: styles.translationLabel,
          list: styles.translationList,
          item: styles.translationItem,
          languageName: styles.translationLangName,
          inputGroup: styles.inputGroup,
          inputLabel: styles.inputLabel,
          inputField: styles.inputField,
          textareaField: styles.textareaField,
        }}
        onChange={onTranslationChange}
      />

      <FormActions
        onCancel={onClose}
        submitLabel={isTranslating ? 'Translating...' : editingQualification ? 'Update' : 'Create'}
        disabled={isTranslating}
      />
    </form>
  </MasterModal>
);

export default QualificationFormModal;
