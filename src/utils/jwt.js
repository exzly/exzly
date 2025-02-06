const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'Exzly';
const jwtExpiration = process.env.JWT_EXPIRATION || '4h';

/**
 * Signs a payload and creates a JWT token with an expiration time.
 *
 * @param {object} payload - The data to be included in the JWT token.
 * @returns {string} The generated JWT token.
 */
const jwtSignIn = (payload, expiresIn) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn || jwtExpiration,
  });
};

/**
 * Verifies the validity of a JWT token.
 *
 * @param {string} token - The JWT token to be verified.
 * @returns {object} The decoded payload if the token is valid.
 * @throws {jwt.JsonWebTokenError} If the token is invalid or expired.
 */
const jwtVerify = (token) => {
  return jwt.verify(token, jwtSecret);
};

/**
 * Decodes a JWT token without verifying its validity.
 *
 * @param {string} token - The JWT token to be decoded.
 * @returns {object} The decoded payload of the token.
 */
const jwtDecode = (token) => {
  return jwt.decode(token);
};

module.exports = { jwtSignIn, jwtVerify, jwtDecode };
