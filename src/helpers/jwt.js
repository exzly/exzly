const { securityConfig } = require('@exzly-config');
const { jwtSignIn } = require('@exzly-utils');

/**
 * Auth token
 *
 * @param {number} userId
 * @returns {string}
 */
const createAuthenticatedToken = (userId) => {
  return jwtSignIn({ userId });
};

/**
 * Reset password
 *
 * @param {number|string} code
 * @returns {string}
 */
const createPasswordResetToken = (code) => {
  return jwtSignIn({ code }, securityConfig.passwordResetExpires);
};

module.exports = { createAuthenticatedToken, createPasswordResetToken };
