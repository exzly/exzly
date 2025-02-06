const securityConfig = require('./security');
const SMTPConfig = require('./smtp');

/**
 * @type {number}
 */
const dataDefaultSize = 10;

/**
 * @type {number}
 */
const dataQuerySizeMax = 100;

module.exports = { dataDefaultSize, dataQuerySizeMax, securityConfig, SMTPConfig };
