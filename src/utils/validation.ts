import { ValidationError } from './errors';

export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

export const validateInput = (input: any, rules: Record<string, ValidationRule[]>) => {
  const errors: string[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = input[field];
    
    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        errors.push(`${field}: ${rule.message}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
};

// Common validation rules
export const required = (message: string = 'This field is required'): ValidationRule => ({
  validator: (value: any) => value !== undefined && value !== null && value !== '',
  message
});

export const minLength = (min: number, message?: string): ValidationRule => ({
  validator: (value: string) => !value || value.length >= min,
  message: message || `Must be at least ${min} characters`
});

export const maxLength = (max: number, message?: string): ValidationRule => ({
  validator: (value: string) => !value || value.length <= max,
  message: message || `Must be no more than ${max} characters`
});

export const isUrl = (message: string = 'Must be a valid URL'): ValidationRule => ({
  validator: (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message
});

export const isEmail = (message: string = 'Must be a valid email'): ValidationRule => ({
  validator: (value: string) => {
    if (!value) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  message
});