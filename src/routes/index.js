const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const httpErrors = require('http-errors');
const compression = require('compression');
const { unless } = require('express-unless');
const {
  viewEngineMiddleware,
  fileLoaderMiddleware,
  sessionMiddleware,
} = require('@exzly-middlewares');
const apiRoutes = require('./api');
const webRoutes = require('./web');
const adminRoutes = require('./admin');
const apiErrorHandler = require('./api/error');
const webErrorHandler = require('./web/error');
const adminErrorHandler = require('./admin/error');

const app = express();

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        'data:',
        "'self'",
        'https://picsum.photos',
        'https://loremflickr.com',
        'https://fastly.picsum.photos',
      ],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      scriptSrcAttr: [(req, res) => `'nonce-${res.locals.nonce}'`],
      // reportUri: `${process.env.API_ROUTE}/csp-violation-report`,
    },
  },
});

helmetMiddleware.unless = unless;

/**
 * Set view engine & proxy
 */
app.set('trust proxy', process.env.TRUST_PROXY);
app.set('view engine', 'njk');
app.use(sessionMiddleware, viewEngineMiddleware);

/**
 * Global middleware
 */
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(helmetMiddleware.unless({ path: ['/public'] }));
app.use('/storage/user-photos/:file', fileLoaderMiddleware.imageLoader.diskStorage('user-photos'));

/**
 * Set routes
 */
app.use(process.env.WEB_ROUTE, webRoutes);
app.use(process.env.API_ROUTE, apiRoutes);
app.use(process.env.ADMIN_ROUTE, adminRoutes);

/**
 * Handle 404 route path
 */
app.use((req, res, next) => {
  switch (req.routeName) {
    case 'api':
      return next(httpErrors.NotFound('Route not found'));

    case 'web':
      return next(httpErrors.NotFound('Page not found'));

    case 'admin':
      return next(httpErrors.NotFound('Page not found'));

    default:
      return next(httpErrors.NotFound('Route not found'));
  }
});

/**
 * Error handler by base routes
 */
app.use((err, req, res, next) => {
  switch (req.routeName) {
    case 'web':
      return webErrorHandler(err, req, res, next);

    case 'api':
      return apiErrorHandler(err, req, res, next);

    case 'admin':
      return adminErrorHandler(err, req, res, next);

    default:
      return next(err);
  }
});

module.exports = app;
