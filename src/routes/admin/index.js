const path = require('path');
const express = require('express');
const { Op } = require('sequelize');
const httpErrors = require('http-errors');
const PDFMake = require('pdfmake');
const { authMiddleware, setRouteName, sessionMiddleware } = require('@exzly-middlewares');
const { UserModel } = require('@exzly-models');

const app = express.Router();

/**
 * Admin middleware
 */
app.use(
  setRouteName('admin'),
  sessionMiddleware,
  authMiddleware.getAuthorization,
  (req, res, next) => {
    const whitelist = /(sign-(in)|(forgot|reset)-password|verification)/;
    const regexPath = whitelist.test(req.path);

    if (req.user && regexPath) {
      return res.redirect(`${process.env.ADMIN_ROUTE}`);
    } else if (!req.user && !regexPath) {
      return res.redirect(`${process.env.ADMIN_ROUTE}/sign-in`);
    }

    return next();
  },
);

app.use(authMiddleware.rejectNonAdmin);

/**
 * Admin route
 */
app.get('/', (req, res) => {
  return res.render('admin/index');
});

/**
 * Sign in
 */
app.get('/sign-in', (req, res) => {
  return res.render('admin/auth/sign-in');
});

/**
 * Forgot password
 */
app.get('/forgot-password', (req, res) => {
  return res.render('admin/auth/forgot-password');
});

/**
 * Sign out
 */
app.get('/sign-out', (req, res) => {
  return req.session.destroy(() => {
    return res.redirect(`${process.env.ADMIN_ROUTE}/sign-in`);
  });
});

/**
 * Users
 */
app.get('/users', async (req, res) => {
  return res.render('admin/users/index', {
    deletedCount: await UserModel.count({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      paranoid: false,
    }),
  });
});

/**
 * Add new user
 */
app.get('/users/add-new', (req, res) => {
  return res.render('admin/users/add-new');
});

/**
 * User profile
 */
app.get('/users/profile/:id', async (req, res, next) => {
  const user = await UserModel.findByPk(req.params.id);

  if (!user) {
    return next(httpErrors.NotFound('User not found'));
  }

  return res.render('admin/users/profile', { user });
});

/**
 * User profile edit
 */
app.get('/users/profile/:id/edit', async (req, res, next) => {
  const user = await UserModel.findByPk(req.params.id);

  if (!user) {
    return next(httpErrors.NotFound('User not found'));
  }

  return res.render('admin/users/profile-edit', { user });
});

/**
 * User account
 */
app.get('/account', (req, res) => {
  return res.render('admin/account/index');
});

/**
 * User account setting
 */
app.get('/account/setting', (req, res) => {
  return res.render('admin/account/setting');
});

/**
 * Generate PDF report
 */
app.get('/generate-pdf', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  const chunks = [];
  const pdf = new PDFMake({
    Roboto: {
      normal: path.join(process.cwd(), '/public/assets/fonts/Roboto/static/Roboto-Regular.ttf'),
      bold: path.join(process.cwd(), '/public/assets/fonts/Roboto/static/Roboto-Bold.ttf'),
      italics: path.join(process.cwd(), '/public/assets/fonts/Roboto/static/Roboto-Italic.ttf'),
      bolditalics: path.join(
        process.cwd(),
        '/public/assets/fonts/Roboto/static/Roboto-BoldItalic.ttf',
      ),
    },
  });

  const document = pdf.createPdfKitDocument({
    pageOrientation: 'portrait',
    defaultStyle: {
      bold: false,
      fontSize: 10,
    },
    watermark: {
      text: `© ${process.env.APP_NAME} ${new Date().getFullYear()}`,
      color: 'blue',
      opacity: 0.3,
      bold: true,
      italics: false,
    },
    content: [
      {
        image: path.join(process.cwd(), '/public/assets/images/kXKAosl3ZCFPwYtfFozS.png'),
        fit: [100, 100],
        alignment: 'center',
      },
      {
        text: 'Generated PDF Report',
        style: {
          bold: true,
          alignment: 'center',
        },
      },
      {
        table: {
          widths: [40, '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: 'HEAD-A',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'HEAD-B',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'HEAD-C',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'HEAD-D',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'HEAD-E',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'HEAD-F',
                bold: true,
                alignment: 'center',
              },
            ],
            ['1', 'B', 'C', 'D', 'E', 'F'],
            [
              {
                text: 2,
                style: { fillColor: 'red' },
              },
              {
                text: 'B',
                style: { fillColor: 'red' },
              },
              {
                text: 'C',
                style: { fillColor: 'red' },
              },
              {
                text: 'D',
                style: { fillColor: 'red' },
              },
              {
                text: 'E',
                style: { fillColor: 'red' },
              },
              {
                text: 'F',
                style: { fillColor: 'red' },
              },
            ],
            [
              {
                text: 3,
                style: { fillColor: 'green' },
              },
              {
                text: 'B',
                style: { fillColor: 'green' },
              },
              {
                text: 'C',
                style: { fillColor: 'green' },
              },
              {
                text: 'D',
                style: { fillColor: 'green' },
              },
              {
                text: 'E',
                style: { fillColor: 'green' },
              },
              {
                text: 'F',
                style: { fillColor: 'green' },
              },
            ],
            ['4', 'B', 'C', 'D', 'E', 'F'],
          ],
        },
      },
      {
        style: {
          alignment: 'center',
        },
        margin: [40, 30],
        table: {
          heights: [10, 60, 10],
          widths: ['*', '*', '*', '*'],
          body: [
            [
              {
                text: 'HEAD-A',
                style: {
                  alignment: 'center',
                },
              },
              {
                text: 'HEAD-B',
                style: {
                  alignment: 'center',
                },
              },
              {
                text: 'HEAD-C',
                style: {
                  alignment: 'center',
                },
              },
              {
                text: 'HEAD-D',
                style: {
                  alignment: 'center',
                },
              },
            ],
            ['', '', '', ''],
            [
              {
                text: 'A',
                style: {
                  alignment: 'center',
                },
              },
              {
                text: 'B',
                style: {
                  alignment: 'center',
                },
              },
              {
                text: 'C',
                style: {
                  alignment: 'center',
                },
              },
              {
                text: 'D',
                style: {
                  alignment: 'center',
                },
              },
            ],
          ],
        },
      },
    ],
    footer: {
      text: `© ${process.env.APP_NAME} ${new Date().getFullYear()}`,
      alignment: 'center',
    },
  });

  document.on('data', (chunk) => chunks.push(chunk));
  document.on('end', () => Buffer.concat(chunks));
  document.pipe(res);
  document.end();
});

module.exports = app;
