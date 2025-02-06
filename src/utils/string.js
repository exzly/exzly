/**
 * Mask an email address by hiding all but the first 3 characters of the local part
 * and the last 2 digits (if any) at the end.
 *
 * @param {string} email - The email address to be masked.
 * @returns {string} The masked email address.
 */
const maskEmail = (email) => {
  const [localPart, domain] = email.split('@');
  const digits = localPart.match(/\d+$/);
  const visibleFrontLength = 3;

  let maskedLocalPart;

  if (digits) {
    const visibleFront = localPart.slice(0, visibleFrontLength);
    const maskedPrefix = localPart.slice(visibleFrontLength, -digits[0].length).replace(/./g, '*');
    maskedLocalPart = visibleFront + maskedPrefix + digits[0];
  } else {
    maskedLocalPart =
      localPart.slice(0, visibleFrontLength) + '*'.repeat(localPart.length - visibleFrontLength);
  }

  return maskedLocalPart + '@' + domain;
};

/**
 * Random string
 *
 * @param {number} length
 * @param {string} chars
 * @returns {string}
 */
const randomString = (
  length = 10,
  chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
) => {
  chars = chars.split('');

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = '';
  for (let i = 0; i < length; i += 1) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};

module.exports = { maskEmail, randomString };
