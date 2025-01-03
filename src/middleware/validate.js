const { validationResult } = require('express-validator');
const { ValidationFailedError } = require('./error');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const validationErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    throw new ValidationFailedError('Validation failed', validationErrors);
  };
};

// Common validation rules
const commonValidations = {
  // User validations
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    trim: true,
    errorMessage: 'Please provide a valid email address',
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
  },
  // Food entry validations
  calories: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'Calories must be a positive number',
    },
  },
  protein: {
    in: ['body'],
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Protein must be a positive number',
    },
  },
  carbs: {
    in: ['body'],
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Carbs must be a positive number',
    },
  },
  fats: {
    in: ['body'],
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Fats must be a positive number',
    },
  },
  // Weight log validations
  weight: {
    in: ['body'],
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Weight must be a positive number',
    },
  },
  date: {
    in: ['body'],
    isISO8601: true,
    toDate: true,
    errorMessage: 'Please provide a valid date',
  },
};

module.exports = {
  validate,
  commonValidations,
};
