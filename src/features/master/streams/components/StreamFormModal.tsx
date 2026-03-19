import type { FormEvent } from 'react';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import FormTextarea from '@/components/common/FormTextarea';
import LanguageChecklistPicker from '@/components/common/LanguageChecklistPicker';
import MasterModal from '@/components/common/MasterModal';
import { CreateStreamDto, LanguageDto, QualificationDto, StreamDto } from '@/types/qualification';
import styles from '@/pages/master/Streams.module.css';
import StreamTranslationFields from './StreamTranslationFields';

interface StreamFormModalProps {
  isOpen: boolean;
  editingStream: StreamDto | null;
  formData: CreateStreamDto;
  qualifications: QualificationDto[];
  languages: LanguageDto[];
  selectedLanguages: number[];
  languagesLoading: boolean;
  autoTranslate: boolean;
  isTranslating: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onQualificationChange: (value: string) => void;
  onLanguageToggle: (languageId: number) => void;
  onAutoTranslateChange: (value: boolean) => void;
  onTranslationChange: (
    languageId: number,
    field: 'name' | 'description',
    value: string,
  ) => void;
}

const StreamFormModal = ({
  isOpen,
  editingStream,
  formData,
  qualifications,
  languages,
  selectedLanguages,
  languagesLoading,
  autoTranslate,
  isTranslating,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
  onQualificationChange,
  onLanguageToggle,
  onAutoTranslateChange,
  onTranslationChange,
}: StreamFormModalProps) => (
  <MasterModal
    isOpen={isOpen}
    title={editingStream ? 'Edit Stream' : 'Add Stream'}
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
      />

      <FormTextarea
        label="Description"
        value={formData.description}
        onChange={onDescriptionChange}
        required
      />

      <FormSelect
        label="Select Qualification"
        value={formData.qualificationId}
        onChange={onQualificationChange}
        options={qualifications.map((qualification) => ({
          value: qualification.id,
          label: qualification.name,
        }))}
        required
        placeholder="Choose a qualification..."
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
        helperText="Select multiple languages for stream name and description translations."
      />

      <StreamTranslationFields
        languages={languages}
        names={formData.names}
        onTranslationChange={onTranslationChange}
      />

      <FormActions
        onCancel={onClose}
        submitLabel={isTranslating ? 'Translating...' : editingStream ? 'Update' : 'Create'}
        disabled={isTranslating}
      />
    </form>
  </MasterModal>
);

export default StreamFormModal;
