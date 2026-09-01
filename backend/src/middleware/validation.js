const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return errorResponse(res, 'Validation Error', 400, errors);
    }

    req.body = value;
    next();
  };
};

const schemas = {

  createContainer: Joi.object({
    aggregateId: Joi.string().required().max(50),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().default(0)
  }),

  loadContainer: Joi.object({
    aggregateId: Joi.string().required(),
    ship: Joi.string().required().max(50),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().required()
  }),

  moveContainer: Joi.object({
    aggregateId: Joi.string().required(),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().required()
  }),

  arriveContainer: Joi.object({
    aggregateId: Joi.string().required(),
    location: Joi.string().required().max(100),
    expectedVersion: Joi.number().required()
  }),

  temperatureSpike: Joi.object({
    aggregateId: Joi.string().required(),
    temperature: Joi.number().required().min(-50).max(100),
    expectedVersion: Joi.number().required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().max(100),
    role: Joi.string().valid('admin', 'user', 'auditor').default('user')
  })
};

module.exports = {
  validate,
  schemas
};
