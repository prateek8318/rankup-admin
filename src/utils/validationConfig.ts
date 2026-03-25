

export interface ValidationConfig {
  minLength: number;
  maxLength: number;
  showCharCount: boolean;
  helperText?: string;
}

export type FieldType = 
  | 'category_name'
  | 'country_name' 
  | 'state_name'
  | 'qualification_name'
  | 'stream_name'
  | 'subject_name'
  | 'description'
  | 'key'
  | 'code';

export const validationConfigs: Record<FieldType, ValidationConfig> = {
  // Name fields with reasonable limits
  category_name: {
    minLength: 1,
    maxLength: 50,
    showCharCount: true,
    // helperText: 'Enter category name (2-50 characters)'
  },
  country_name: {
    minLength: 2,
    maxLength: 50,
    showCharCount: true,
    // helperText: 'Enter country name (2-50 characters)'
  },
  state_name: {
    minLength: 2,
    maxLength: 50,
    showCharCount: true,
    // helperText: 'Enter state name (2-50 characters)'
  },
  qualification_name: {
    minLength: 2,
    maxLength: 60,
    showCharCount: true,
    // helperText: 'Enter qualification name (2-60 characters)'
  },
  stream_name: {
    minLength: 2,
    maxLength: 60,
    showCharCount: true,
    // helperText: 'Enter stream name (2-60 characters)'
  },
  subject_name: {
    minLength: 2,
    maxLength: 60,
    showCharCount: true,
    // helperText: 'Enter subject name (2-60 characters)'
  },

  // Description fields with higher limits
  description: {
    minLength: 10,
    maxLength: 200,
    showCharCount: true,
    // helperText: 'Enter description (10-200 characters)'
  },

  // Code/Key fields with specific limits
  key: {
    minLength: 2,
    maxLength: 20,
    showCharCount: true,
    // helperText: 'Enter key (2-20 characters, lowercase, no spaces)'
  },
  code: {
    minLength: 1,
    maxLength: 10,
    showCharCount: true,
    // helperText: 'Enter code (1-10 characters)'
  }
};

/**
 * Get validation configuration for a specific field type
 * @param fieldType - The type of field to validate
 * @returns ValidationConfig object
 */
export const getValidationConfig = (fieldType: FieldType): ValidationConfig => {
  return validationConfigs[fieldType] || {
    minLength: 1,
    maxLength: 100,
    showCharCount: false,
    // helperText: 'Enter valid text'
  };
};

/**
 * Custom validation configuration override
 * Allows dynamic configuration based on page context
 */
export const createCustomValidation = (
  overrides: Partial<ValidationConfig>
): ValidationConfig => {
  return {
    minLength: 1,
    maxLength: 100,
    showCharCount: true,
    // helperText: 'Enter valid text',
    ...overrides
  };
};

/**
 * Page-specific validation presets
 */
export const pageValidations = {
  categories: {
    nameEn: getValidationConfig('category_name'),
    nameHi: getValidationConfig('category_name'),
    key: getValidationConfig('key')
  },
  countries: {
    nameEn: getValidationConfig('country_name'),
    nameHi: getValidationConfig('country_name'),
    code: getValidationConfig('code')
  },
  states: {
    name: getValidationConfig('state_name'),
    code: createCustomValidation({ maxLength: 2, helperText: '2-letter state code (e.g., BR, MH)' })
  },
  qualifications: {
    name: getValidationConfig('qualification_name'),
    description: getValidationConfig('description')
  },
  streams: {
    name: getValidationConfig('stream_name'),
    description: getValidationConfig('description')
  },
  subjects: {
    name: getValidationConfig('subject_name'),
    description: getValidationConfig('description')
  }
};
