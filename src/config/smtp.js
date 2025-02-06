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
  port: 587,
  host: '',
  from: '',
  auth: {
    user: '',
    pass: '',
  },
};
