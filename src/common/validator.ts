import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(4).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 4 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
      'any.required': 'Password is required',
    }),
});


export const productSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least 3 characters',
    'any.required': 'Name is required',
  }),
  description: Joi.string().min(10).required().messages({
    'string.base': 'Description should be a string',
    'string.min': 'Description should have at least 10 characters',
    'any.required': 'Description is required',
  }),
  price: Joi.number().greater(0).required().messages({
    'number.base': 'Price should be a number',
    'number.greater': 'Price should be greater than 0',
    'any.required': 'Price is required',
  }),
  // owner: Joi.string().required().messages({
  //   'string.base': 'Owner should be a valid user ID',
  //   'any.required': 'Owner is required',
  // }),
});

