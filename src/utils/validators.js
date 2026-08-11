/**
 * Form Validation Rules
 */
export const VALIDATION_RULES = {
  email: {
    required: 'Email address is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  phone: {
    required: 'Mobile phone number is required',
    pattern: {
      value: /^(\+?971|0)?5[0245689]\d{7}$/,
      message: 'Enter a valid UAE mobile number (e.g. +971 50 123 4567)'
    }
  },
  requiredName: {
    required: 'Full name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    }
  }
};
