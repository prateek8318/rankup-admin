import type { FormEvent } from 'react';
import FormActions from '@/components/common/FormActions';
import FormCheckbox from '@/components/common/FormCheckbox';
import FormInput from '@/components/common/FormInput';
import MasterModal from '@/components/common/MasterModal';
import { CountryDto, CreateCountryDto } from '@/services/masterApi';

interface CountryFormModalProps {
  isOpen: boolean;
  editingCountry: CountryDto | null;
  formData: CreateCountryDto;
  autoTranslate: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onNameEnChange: (value: string) => void | Promise<void>;
  onNameHiChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onAutoTranslateChange: (value: boolean) => void;
  onActiveChange: (value: boolean) => void;
}

const CountryFormModal = ({
  isOpen,
  editingCountry,
  formData,
  autoTranslate,
  onClose,
  onSubmit,
  onNameEnChange,
  onNameHiChange,
  onCodeChange,
  onAutoTranslateChange,
  onActiveChange,
}: CountryFormModalProps) => (
  <MasterModal
    isOpen={isOpen}
    title={editingCountry ? 'Edit Country' : 'Add Country'}
  >
    <form onSubmit={onSubmit}>
      <FormInput
        label="Country Name (English)"
        value={formData.nameEn || ''}
        onChange={onNameEnChange}
        required
      />

      <FormInput
        label="Country Name (Hindi)"
        value={formData.nameHi || ''}
        onChange={onNameHiChange}
      />

      <FormInput
        label="Code"
        value={formData.code}
        onChange={onCodeChange}
        required
      />

      <FormCheckbox
        label="Auto-translate to Hindi"
        checked={autoTranslate}
        onChange={onAutoTranslateChange}
      />

      <FormCheckbox
        label="Active"
        checked={formData.isActive || false}
        onChange={onActiveChange}
      />

      <FormActions
        onCancel={onClose}
        submitLabel={editingCountry ? 'Update' : 'Create'}
      />
    </form>
  </MasterModal>
);

export default CountryFormModal;
