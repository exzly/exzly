const ms = require('ms');
const moment = require('moment');
const express = require('express');
const { Op } = require('sequelize');
const { SHA1 } = require('crypto-js');
const httpErrors = require('http-errors');
const rateLimit = require('express-rate-limit');
const { matchedData } = require('express-validator');
const { securityConfig } = require('@exzly-config');
const { emailHelper, jwtHelper } = require('@exzly-helpers');
const { UserModel, AuthVerifyModel } = require('@exzly-models');
const { randomInt, createURL, maskEmail } = require('@exzly-utils');
const { authValidator } = require('@exzly-validators');

const app = express.Router();

/**
 * Sign up
 */
app.post(
  '/sign-up',
  rateLimit({
    windowMs: ms(securityConfig.rateLimit.signUpRateLimitDuration),
    max: securityConfig.rateLimit.maxSignUpAttempts,
    message: (req, res) => {
      const duration = `${moment.duration(ms(securityConfig.rateLimit.signUpRateLimitDuration)).asMinutes()}`;

      return {
        statusCode: res.statusCode,
        message: `Too many requests. Please try again after ${duration} minutes`,
      };
    },
  }),
  [authValidator.signUp],
  async (req, res, next) => {
    try {
      const { email, username, password, fullName } = matchedData(req, { locations: ['body'] });
      const newUser = await UserModel.create({
        email,
        username,
        password,
        fullName,
      });

      const user = newUser.toJSON();

      // remove unnecessary object
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;

      // send response
      return res.status(201).json({ user });
    } catch (error) {
      return next(error);
    }
  },
);

/**
 * Sign in
 */
app.post(
  '/sign-in',
  rateLimit({
    windowMs: ms(securityConfig.rateLimit.signInRateLimitDuration),
    max: securityConfig.rateLimit.maxSignInAttempts,
    message: (req, res) => {
      const duration = `${moment.duration(ms(securityConfig.rateLimit.signInRateLimitDuration)).asMinutes()}`;

      return {
        statusCode: res.statusCode,
        message: `Too many requests. Please try again after ${duration} minutes`,
      };
    },
  }),
  [authValidator.signIn],
  async (req, res, next) => {
    const { identity, password } = matchedData(req, { locations: ['body'] });
    const auth = await UserModel.findOne({
      where: {
        [Op.or]: [{ email: identity }, { username: identity }],
      },
      attributes: {
        include: ['password'],
      },
    });

    if (auth === null) {
      // invalid identity
      return next(httpErrors.Unauthorized('Invalid credentials'));
    }

    if (SHA1(password).toString() !== auth.password) {
      // invalid password
      return next(httpErrors.Unauthorized('Invalid credentials'));
    }

    const user = {
      id: auth.id,
      email: auth.email,
      username: auth.username,
      isAdmin: auth.isAdmin,
      fullName: auth.fullName,
    };
    const token = jwtHelper.createAuthenticatedToken(auth.id);

    // create session
    if (req.session) {
      req.session.userId = auth.id;
      req.session.save();
    }

    // send response
    return res.json({ user, token });
  },
);

/**
 * Verification
 */
app.post(
  '/verification',
  rateLimit({
    windowMs: ms(securityConfig.rateLimit.verificationRateLimitDuration),
    max: securityConfig.rateLimit.maxVerificationAttempts,
    message: (req, res) => {
      const duration = `${moment.duration(ms(securityConfig.rateLimit.verificationRateLimitDuration)).asMinutes()}`;

      return {
        statusCode: res.statusCode,
        message: `Too many requests. Please try again after ${duration} minutes`,
      };
    },
  }),
  [authValidator.verification],
  async (req, res, next) => {
    const { code } = matchedData(req, { locations: ['body'] });
    const authVerify = await AuthVerifyModel.findOne({ where: { code } });

    if (!authVerify) {
      // send error : invalid code
      return next(httpErrors.BadRequest('Invalid code'));
    }

    if (authVerify.codeIsUsed) {
      // send error : verification code has been used
      return next(httpErrors.BadRequest('The verification code has already been used'));
    }

    if (new Date(authVerify.expiresAt) < new Date()) {
      // send error : verification code has been used
      return next(
        httpErrors.BadRequest('The verification code has expired. Please request a new one'),
      );
    }

    if (authVerify.purpose === 'password-reset') {
      const token = jwtHelper.createPasswordResetToken(authVerify.code);

      await authVerify.update({
        token,
        expiresAt: new Date(Date.now() + ms(securityConfig.passwordResetExpires)), // update for token expires
        codeIsUsed: true,
      });

      if (req.session) {
        req.session.cookie.maxAge = ms(securityConfig.passwordResetExpires);
        req.session.resetPassword = true;
        req.session.save();
      }

      // send response
      return res.json({ purpose: authVerify.purpose, token });
    }

    return next();
  },
);

/**
 * Forgot password
 */
app.post(
  '/forgot-password',
  rateLimit({
    windowMs: ms(securityConfig.rateLimit.forgotPasswordRateLimitDuration),
    max: securityConfig.rateLimit.maxForgotPasswordAttempts,
    message: (req, res) => {
      const duration = `${moment.duration(ms(securityConfig.rateLimit.forgotPasswordRateLimitDuration)).asMinutes()}`;

      return {
        statusCode: res.statusCode,
        message: `Too many requests. Please try again after ${duration} minutes`,
      };
    },
  }),
  [authValidator.forgotPassword],
  async (req, res, next) => {
    try {
      const { identity } = matchedData(req, { locations: ['body'] });
      const user = await UserModel.findOne({
        where: {
          [Op.or]: [
            {
              email: identity,
            },
            {
              username: identity,
            },
          ],
        },
      });

      if (!user) {
        // send error : user not found
        return next(httpErrors.NotFound('User not found'));
      }

      let code;
      const disallowedCodes = [
        '000000',
        '111111',
        '222222',
        '333333',
        '444444',
        '555555',
        '666666',
        '777777',
        '888888',
        '999999',
      ];

      do {
        code = randomInt(1, 10, 6);
      } while (disallowedCodes.includes(code));

      const sha1 = SHA1(code).toString();
      const resetLink = createURL(req, 'web', `/verification?token=${sha1}`);

      await AuthVerifyModel.create({
        code,
        sha1,
        purpose: 'password-reset',
        userId: user.id,
        expiresAt: new Date(Date.now() + ms(securityConfig.passwordResetExpires)),
      });

      await emailHelper.sendMail(
        'reset-password.njk',
        { user, reset_link: resetLink, verification_code: code },
        {
          to: user.email,
          subject: 'Reset Password',
        },
        'html',
      );

      // send response
      return res.json({
        email: maskEmail(user.email),
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      return next(error);
    }
  },
);

/**
 * Reset password
 */
app.post('/reset-password', [authValidator.resetPassword], async (req, res, next) => {
  const { token } = matchedData(req, { locations: ['body'] });
  const authVerify = await AuthVerifyModel.findOne({
    where: { token },
    include: [
      {
        model: UserModel,
        as: 'user',
      },
    ],
  });

  if (!authVerify) {
    // send error : token doesn't exist
    return next(httpErrors.BadRequest('Invalid request. Please request a new one'));
  }

  if (authVerify.tokenIsUsed) {
    // send error : token has been used
    return next(httpErrors.BadRequest('Invalid request. Please request a new one'));
  }

  if (new Date(authVerify.expiresAt) < new Date()) {
    // send error : token expired
    return next(
      httpErrors.BadRequest('The verification code has expired. Please request a new one'),
    );
  }

  await authVerify.update({ tokenIsUsed: true });
  await authVerify.user.update({ password: req.body.newPassword });

  if (req.session?.resetPassword) {
    delete req.session.resetPassword;
  }

  // send response
  return res.json({ success: true });
});

module.exports = app;
