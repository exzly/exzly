const nunjucks = require('nunjucks');
const nodemailer = require('nodemailer');
const { SMTPConfig } = require('@exzly-config');

const SMTPTransport = nodemailer.createTransport(SMTPConfig);
const templateLoader = nunjucks.configure('src/views/email', {
  watch: process.env.NODE_ENV === 'development',
  noCache: process.env.NODE_ENV === 'development',
  autoescape: true,
});

templateLoader.addGlobal('year', new Date().getFullYear());
templateLoader.addGlobal('app_name', process.env.APP_NAME);

/**
 * Send email through SMTP
 *
 * @param {string} template
 * @param {object} context
 * @param {import('nodemailer').SendMailOptions} option
 * @param {html|text} mode
 */
const sendMail = (template, context, option, mode = 'text') => {
  const sendMail = SMTPTransport.sendMail({
    html: mode.toLowerCase() === 'html' ? templateLoader.render(template, context) : undefined,
    text:
      mode.toLowerCase() === 'text' ? templateLoader.renderString(template, context) : undefined,
    from: SMTPConfig.from,
    ...option,
  });

  return sendMail;
};

module.exports = { sendMail };
