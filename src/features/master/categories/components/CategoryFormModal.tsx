import type { FormEvent } from 'react';
import FormActions from '@/components/common/FormActions';
import FormInput from '@/components/common/FormInput';
import MasterModal from '@/components/common/MasterModal';
import { CategoryDto, CreateCategoryDto } from '@/services/masterApi';

interface CategoryFormModalProps {
  isOpen: boolean;
  editingCategory: CategoryDto | null;
  formData: CreateCategoryDto;
  errors: Record<string, string>;
  autoTranslate: boolean;
  isTranslating: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onNameEnChange: (value: string) => void | Promise<void>;
  onNameHiChange: (value: string) => void | Promise<void>;
  onKeyChange: (value: string) => void;
  onAutoTranslateChange: (value: boolean) => void;
}

const CategoryFormModal = ({
  isOpen,
  editingCategory,
  formData,
  errors,
  autoTranslate,
  isTranslating,
  onClose,
  onSubmit,
  onNameEnChange,
  onNameHiChange,
  onKeyChange,
  onAutoTranslateChange,
}: CategoryFormModalProps) => (
  <MasterModal
    isOpen={isOpen}
    title={editingCategory ? 'Edit Category' : 'Add Category'}
  >
    <form onSubmit={onSubmit}>
      <FormInput
        label="Category Name"
        value={formData.nameEn}
        onChange={onNameEnChange}
        required
        error={errors.nameEn}
      />

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <label style={{ fontSize: '14px', fontWeight: '500' }}>
            Category Name (Hindi)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="categoryAutoTranslate"
              checked={autoTranslate}
              onChange={(event) => onAutoTranslateChange(event.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label
              htmlFor="categoryAutoTranslate"
              style={{ fontSize: '12px', color: '#6b7280', cursor: 'pointer' }}
            >
              Auto-translate
            </label>
          </div>
        </div>
        <input
          type="text"
          value={formData.nameHi || ''}
          onChange={(event) => {
            void onNameHiChange(event.target.value);
          }}
          placeholder={isTranslating ? 'Translating...' : ''}
          disabled={isTranslating}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            opacity: isTranslating ? 0.6 : 1,
            backgroundColor: isTranslating ? '#f9fafb' : '#fff',
            boxSizing: 'border-box',
          }}
        />
        {isTranslating && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Auto-translating...
          </p>
        )}
      </div>

      <FormInput
        label="Key"
        value={formData.key}
        onChange={onKeyChange}
        required
        placeholder="e.g., general, obc, sc"
        helperText="Unique key for the category (lowercase, no spaces)"
        error={errors.key}
      />

      <FormActions
        onCancel={onClose}
        submitLabel={editingCategory ? 'Update' : 'Create'}
      />
    </form>
  </MasterModal>
);

export default CategoryFormModal;
