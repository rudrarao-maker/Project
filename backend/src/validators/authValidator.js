const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian mobile number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  body('aadhaar')
    .optional()
    .matches(/^\d{12}$/).withMessage('Aadhaar must be 12 digits'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
];
const resetPasswordValidator = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

module.exports = { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator };
