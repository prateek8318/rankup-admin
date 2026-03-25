import type { FormEvent } from 'react';
import FormActions from '@/components/common/FormActions';
import FormCheckbox from '@/components/common/FormCheckbox';
import FormInput from '@/components/common/FormInput';
import FormSelect from '@/components/common/FormSelect';
import LanguageChecklistPicker from '@/components/common/LanguageChecklistPicker';
import MasterModal from '@/components/common/MasterModal';
import NameTranslationFields from '@/features/master/shared/components/NameTranslationFields';
import { pageValidations } from '@/utils/validationConfig';
import { CountryDto, CreateStateDto, LanguageDto, StateDto } from '@/services/masterApi';
import styles from '@/styles/pages/States.module.css';

interface StateFormModalProps {
  isOpen: boolean;
  editingState: StateDto | null;
  formData: CreateStateDto;
  errors: Record<string, string>;
  countries: CountryDto[];
  languages: LanguageDto[];
  isTranslating: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onNameChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onLanguageToggle: (languageId: number) => void;
  onTranslationChange: (languageId: number, value: string) => void;
  onActiveChange: (checked: boolean) => void;
}

const StateFormModal = ({
  isOpen,
  editingState,
  formData,
  errors,
  countries,
  languages,
  isTranslating,
  onClose,
  onSubmit,
  onNameChange,
  onCountryChange,
  onCodeChange,
  onLanguageToggle,
  onTranslationChange,
  onActiveChange,
}: StateFormModalProps) => (
  <MasterModal
    isOpen={isOpen}
    title={editingState ? 'Edit State' : 'Add State'}
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
        validationConfig={pageValidations.states.name}
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
        helperText="Select country from API data. Country code will be auto-filled."
        error={errors.countryCode}
      />

      <FormInput
        label="State Code"
        value={formData.code}
        onChange={onCodeChange}
        required
        placeholder="e.g., BR, MH, UP"
        error={errors.code}
        validationConfig={pageValidations.states.code}
      />

      <LanguageChecklistPicker
        label="Select Languages (Multi-Select)"
        languages={languages}
        selectedLanguageIds={(formData.names || []).map((name) => name.languageId)}
        onToggle={onLanguageToggle}
        disabled={isTranslating}
        helperText="Select multiple languages for state name translations."
      />
      {errors.names && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
          {errors.names}
        </div>
      )}

      <NameTranslationFields
        label="State Names by Language *"
        languages={languages}
        items={formData.names || []}
        classNames={{
          section: styles.translationSection,
          label: styles.translationLabel,
          item: styles.translationItem,
          languageName: styles.translationLangName,
          inputField: styles.translationInput,
        }}
        onChange={onTranslationChange}
      />

      <FormCheckbox
        label="Active"
        checked={formData.isActive ?? true}
        onChange={onActiveChange}
      />

      <FormActions
        onCancel={onClose}
        submitLabel={editingState ? 'Update' : 'Create'}
      />
    </form>
  </MasterModal>
);

export default StateFormModal;
