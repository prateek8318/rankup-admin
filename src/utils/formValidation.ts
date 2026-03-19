export interface FormValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormValidationRules {
  [fieldName: string]: FormValidationRule;
}

export interface FormErrors {
  [fieldName: string]: string;
}

export class FormValidator {
  static validate(value: any, rules: FormValidationRule): string | null {
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required';
    }

    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Minimum length is ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength} characters`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Invalid format';
      }
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }

  static validateForm(formData: any, validationRules: FormValidationRules): FormErrors {
    const errors: FormErrors = {};

    Object.keys(validationRules).forEach(fieldName => {
      const error = this.validate(formData[fieldName], validationRules[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numbersOnly: /^[0-9]+$/,
  lettersOnly: /^[a-zA-Z\s]+$/
};

// Common validation rules
export const CommonValidationRules = {
  required: { required: true },
  email: { required: true, pattern: ValidationPatterns.email },
  phone: { required: true, pattern: ValidationPatterns.phone },
  name: { required: true, minLength: 2, maxLength: 50, pattern: ValidationPatterns.lettersOnly },
  description: { required: true, minLength: 10, maxLength: 500 }
};
