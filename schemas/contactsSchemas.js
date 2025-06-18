import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 255 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/).required().messages({
    'string.base': 'Phone must be a string',
    'string.empty': 'Phone is required',
    'string.pattern.base': 'Phone must be in format (XXX) XXX-XXXX',
    'any.required': 'Phone is required'
  }),
  favorite: Joi.boolean().messages({
    'boolean.base': 'Favorite must be a boolean value'
  })
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(255).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 255 characters'
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address'
  }),
  phone: Joi.string().pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/).messages({
    'string.base': 'Phone must be a string',
    'string.pattern.base': 'Phone must be in format (XXX) XXX-XXXX'
  }),
  favorite: Joi.boolean().messages({
    'boolean.base': 'Favorite must be a boolean value'
  })
}).min(1).messages({
  'object.min': 'At least one field (name, email, phone, or favorite) must be provided'
});

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'boolean.base': 'Favorite must be a boolean value',
    'any.required': 'Favorite field is required'
  })
});