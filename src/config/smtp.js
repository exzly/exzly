/**
 * @typedef {Object} SMTPAuth
 * @property {string} user - The username for SMTP authentication.
 * @property {string} pass - The password for SMTP authentication.
 */

/**
 * @typedef {Object} SMTPConfig
 * @property {number} port - The port number for the SMTP server.
 * @property {string} host - The hostname or IP address of the SMTP server.
 * @property {string} from - The default sender's email address (e.g., "No Reply <no-reply@domain.com>").
 * @property {SMTPAuth} auth - The authentication credentials for the SMTP server.
 */

/**
 * SMTP configuration for sending emails.
 *
 * @type {SMTPConfig}
 */
module.exports = {
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  from: process.env.SMTP_FROM,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
