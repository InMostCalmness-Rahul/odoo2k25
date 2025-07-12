const { body } = require('express-validator');

// Validation rules for user signup
const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),

  body('skillsOffered')
    .optional()
    .isArray()
    .withMessage('Skills offered must be an array')
    .custom((skills) => {
      if (skills && skills.length > 20) {
        throw new Error('Cannot offer more than 20 skills');
      }
      if (skills && skills.some(skill => typeof skill !== 'string' || skill.trim().length > 100)) {
        throw new Error('Each skill must be a string with maximum 100 characters');
      }
      return true;
    }),

  body('skillsWanted')
    .optional()
    .isArray()
    .withMessage('Skills wanted must be an array')
    .custom((skills) => {
      if (skills && skills.length > 20) {
        throw new Error('Cannot want more than 20 skills');
      }
      if (skills && skills.some(skill => typeof skill !== 'string' || skill.trim().length > 100)) {
        throw new Error('Each skill must be a string with maximum 100 characters');
      }
      return true;
    }),

  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array')
    .custom((availability) => {
      const validOptions = ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons', 'flexible'];
      if (availability && availability.some(option => !validOptions.includes(option))) {
        throw new Error('Invalid availability option. Valid options are: ' + validOptions.join(', '));
      }
      return true;
    })
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for user profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),

  body('skillsOffered')
    .optional()
    .isArray()
    .withMessage('Skills offered must be an array')
    .custom((skills) => {
      if (skills && skills.length > 20) {
        throw new Error('Cannot offer more than 20 skills');
      }
      if (skills && skills.some(skill => typeof skill !== 'string' || skill.trim().length > 100)) {
        throw new Error('Each skill must be a string with maximum 100 characters');
      }
      return true;
    }),

  body('skillsWanted')
    .optional()
    .isArray()
    .withMessage('Skills wanted must be an array')
    .custom((skills) => {
      if (skills && skills.length > 20) {
        throw new Error('Cannot want more than 20 skills');
      }
      if (skills && skills.some(skill => typeof skill !== 'string' || skill.trim().length > 100)) {
        throw new Error('Each skill must be a string with maximum 100 characters');
      }
      return true;
    }),

  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array')
    .custom((availability) => {
      const validOptions = ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons', 'flexible'];
      if (availability && availability.some(option => !validOptions.includes(option))) {
        throw new Error('Invalid availability option. Valid options are: ' + validOptions.join(', '));
      }
      return true;
    }),

  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
];

// Validation rules for swap request creation
const validateSwapRequest = [
  body('toUser')
    .isMongoId()
    .withMessage('Invalid user ID'),

  body('offeredSkill')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Offered skill must be between 1 and 100 characters'),

  body('requestedSkill')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Requested skill must be between 1 and 100 characters'),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),

  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid date'),

  body('duration')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Duration cannot exceed 100 characters'),

  body('meetingType')
    .optional()
    .isIn(['online', 'in-person', 'hybrid'])
    .withMessage('Meeting type must be online, in-person, or hybrid'),

  body('meetingDetails')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Meeting details cannot exceed 500 characters')
];

// Validation rules for swap request status update
const validateSwapStatusUpdate = [
  body('status')
    .isIn(['accepted', 'rejected', 'completed', 'cancelled'])
    .withMessage('Invalid status. Must be accepted, rejected, completed, or cancelled'),

  body('rejectionReason')
    .if(body('status').equals('rejected'))
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters'),

  body('cancellationReason')
    .if(body('status').equals('cancelled'))
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason cannot exceed 500 characters')
];

// Validation rules for feedback
const validateFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

module.exports = {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validateSwapRequest,
  validateSwapStatusUpdate,
  validateFeedback
};
