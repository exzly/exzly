/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(err: any, req: Request, res: Response, next: NextFunction) => void} ExpressErrorHandler
 */

const fs = require('fs');
const path = require('path');
const httpErrors = require('http-errors');
const { winstonLogger, createRoute } = require('@exzly-utils');

/** @type {ExpressErrorHandler} */
module.exports = (err, req, res, next) => {
  /**
   * Error logging
   */
  if (!httpErrors.isHttpError(err)) {
    winstonLogger.error(err);
  }

  if (!res.headersSent) {
    if (!req.user) {
      return res.redirect(createRoute('web'));
    }

    if (httpErrors.isHttpError(err)) {
      const errorView = `admin/errors/${err.status}.njk`;

      if (fs.existsSync(path.join(process.cwd(), 'src/views', errorView))) {
        return res.status(err.status).render(`admin/errors/${err.status}.njk`, { error: err });
      }

      return res.status(err.status).render(`admin/errors/default.njk`, { error: err });
    }

    return res.status(500).render(`admin/errors/default.njk`, { error: err });
  }

  return next(err);
};
