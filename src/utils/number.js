/**
 * Random number
 *
 * @param {number} min
 * @param {number} max
 * @param {number} length
 * @returns {number|string}
 */
const randomInt = (min = 1, max = 10, length = false) => {
  let i = 0;
  let code = '';
  const characters = '0123456789';
  const random = Math.floor(Math.random() * (max - min + 1)) + min;

  if (!length) {
    return random;
  }

  while (i < length) {
    const randomIndex = Math.floor(Math.random() * random);
    code += characters.charAt(randomIndex);
    i += 1;
  }

  return code;
};

module.exports = { randomInt };
