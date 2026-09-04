const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return errorResponse(res, 'Validation Error', 400, errors);
    }
    req.body = value;
    next();
  };
};

const schemas = {
  createContainer: Joi.object({
    aggregateId: Joi.string()
      .required()
      .max(50)
      .pattern(/^[A-Z0-9-]+$/, 'alphanumeric with hyphens')
      .messages({
        'string.empty': 'Container ID is required',
        'string.max': 'Container ID cannot exceed 50 characters',
        'string.pattern.name': 'Container ID can only contain uppercase letters, numbers, and hyphens'
      }),
    location: Joi.string()
      .required()
      .max(100)
      .messages({
        'string.empty': 'Location is required',
        'string.max': 'Location cannot exceed 100 characters'
      }),
    expectedVersion: Joi.number()
      .integer()
      .min(0)
      .default(0)
  }),

  loadContainer: Joi.object({
    aggregateId: Joi.string().required(),
    ship: Joi.string()
      .required()
      .max(50)
      .messages({
        'string.empty': 'Ship name is required',
        'string.max': 'Ship name cannot exceed 50 characters'
      }),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().integer().min(0).required()
      .messages({
        'any.required': 'Expected version is required',
        'number.min': 'Expected version must be greater than or equal to 0'
      })
  }),

  moveContainer: Joi.object({
    aggregateId: Joi.string().required(),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().integer().min(0).required()
  }),

  arriveContainer: Joi.object({
    aggregateId: Joi.string().required(),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().integer().min(0).required()
  }),

  temperatureSpike: Joi.object({
    aggregateId: Joi.string().required(),
    temperature: Joi.number()
      .required()
      .min(-50)
      .max(100)
      .messages({
        'number.base': 'Temperature must be a number',
        'number.min': 'Temperature cannot be below -50°C',
        'number.max': 'Temperature cannot exceed 100°C'
      }),
    expectedVersion: Joi.number().integer().min(0).required()
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .min(6)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters'
      })
  }),

  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'password strength')
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    name: Joi.string()
      .required()
      .max(100)
      .messages({
        'string.empty': 'Name is required',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    role: Joi.string()
      .valid('admin', 'user', 'auditor')
      .default('user')
  }),

  updateProfile: Joi.object({
    name: Joi.string().max(100),
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark'),
      notifications: Joi.boolean()
    })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'string.empty': 'Current password is required'
      }),
    newPassword: Joi.string()
      .required()
      .min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'password strength')
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 6 characters',
        'string.pattern.name': 'New password must contain at least one uppercase letter, one lowercase letter, and one number'
      })
  })
};

module.exports = {
  validate,
  schemas
};
