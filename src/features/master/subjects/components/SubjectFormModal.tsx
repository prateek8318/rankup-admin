import type { FormEvent } from 'react';
import FormActions from '@/components/common/FormActions';
import FormCheckbox from '@/components/common/FormCheckbox';
import FormInput from '@/components/common/FormInput';
import FormTextarea from '@/components/common/FormTextarea';
import MasterModal from '@/components/common/MasterModal';
import { pageValidations } from '@/utils/validationConfig';
import { CreateSubjectDto, LanguageDto, SubjectDto } from '@/services/masterApi';
import SubjectTranslationFields from './SubjectTranslationFields';

interface SubjectFormModalProps {
  isOpen: boolean;
  editingSubject: SubjectDto | null;
  formData: CreateSubjectDto;
  languages: LanguageDto[];
  autoTranslate: boolean;
  isTranslating: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAutoTranslateChange: (value: boolean) => void;
  onTranslationsChange: (updater: (names: NonNullable<CreateSubjectDto['names']>) => NonNullable<CreateSubjectDto['names']>) => void;
}

const SubjectFormModal = ({
  isOpen,
  editingSubject,
  formData,
  languages,
  autoTranslate,
  isTranslating,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
  onAutoTranslateChange,
  onTranslationsChange,
}: SubjectFormModalProps) => (
  <MasterModal
    isOpen={isOpen}
    title={editingSubject ? 'Edit Subject' : 'Add Subject'}
    width={600}
  >
    <form onSubmit={onSubmit}>
      <FormInput
        label="Name"
        value={formData.name}
        onChange={onNameChange}
        required
        validationConfig={pageValidations.subjects.name}
      />

      <FormTextarea
        label="Description"
        value={formData.description || ''}
        onChange={onDescriptionChange}
      />

      <FormCheckbox
        label="Auto-translate when name changes"
        checked={autoTranslate}
        onChange={onAutoTranslateChange}
      />
      {isTranslating && <small>Translating...</small>}

      <SubjectTranslationFields
        languages={languages}
        names={formData.names || []}
        onLanguageChange={(index, languageId) => onTranslationsChange((names) => {
          const updated = [...names];
          updated[index] = { ...updated[index], languageId };
          return updated;
        })}
        onNameChange={(index, value) => onTranslationsChange((names) => {
          const updated = [...names];
          updated[index] = { ...updated[index], name: value };
          return updated;
        })}
        onDescriptionChange={(index, value) => onTranslationsChange((names) => {
          const updated = [...names];
          updated[index] = { ...updated[index], description: value };
          return updated;
        })}
      />

      <FormActions
        onCancel={onClose}
        submitLabel={editingSubject ? 'Update' : 'Create'}
        disabled={isTranslating}
      />
    </form>
  </MasterModal>
);

export default SubjectFormModal;
