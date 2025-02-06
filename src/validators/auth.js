/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const { body } = require('express-validator');
const { runValidation } = require('@exzly-middlewares');
const { UserModel } = require('@exzly-models');
const userValidator = require('./user');

/**
 * @type {ExpressMiddleware[]}
 */
const signUp = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .custom(async (value) => {
      const isRegistered = await UserModel.findOne({ where: { email: value } });

      if (!isRegistered) {
        return true;
      }

      throw new Error('Email is already in use');
    }),

  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('This field must be a string')
    .custom((value) => {
      const regex = userValidator.dataValidation.usernameRegEx;
      return regex.test(value);
    })
    .withMessage(
      'Username format is invalid. Use letters, numbers, "_", or ".", and avoid consecutive symbols like ".." or "__"',
    )
    .custom(async (value) => {
      const user = await UserModel.findOne({ where: { username: value } });

      if (!user) {
        return true;
      }

      throw new Error('Username is already taken');
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('This field must be a string')
    .isLength({ min: userValidator.dataValidation.passwordMin })
    .withMessage(
      `Password must be at least ${userValidator.dataValidation.passwordMin} characters long`,
    ),

  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Gender must be either "male" or "female"'),

  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isString()
    .withMessage('This field must be a string')
    .isLength({ min: userValidator.dataValidation.fullNameMin })
    .withMessage(
      `Full name must be at least ${userValidator.dataValidation.fullNameMin} characters long`,
    )
    .isLength({ max: userValidator.dataValidation.fullNameMax })
    .withMessage(
      `Full name must be no more than ${userValidator.dataValidation.fullNameMax} characters long`,
    )
    .escape(),

  runValidation,
];

/**
 * @type {ExpressMiddleware[]}
 */
const signIn = [
  body('identity')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),

  body('password')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),

  runValidation,
];

/**
 * @type {ExpressMiddleware[]}
 */
const forgotPassword = [
  body('identity')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),
  runValidation,
];

/**
 * @type {ExpressMiddleware[]}
 */
const resetPassword = [
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isString()
    .withMessage('This field must be a string')
    .isLength({ min: userValidator.dataValidation.passwordMin })
    .withMessage(
      `New password must be at least ${userValidator.dataValidation.passwordMin} characters long`,
    ),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .isString()
    .withMessage('This field must be a string')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Confirm password do not match'),

  body('token')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),

  runValidation,
];

const verification = [
  body('code')
    .notEmpty()
    .withMessage('This field is required')
    .isString()
    .withMessage('This field must be a string'),
  runValidation,
];

module.exports = {
  signUp,
  signIn,
  resetPassword,
  forgotPassword,
  verification,
};
