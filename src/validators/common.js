/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {(req: Request, res: Response, next: NextFunction) => void} ExpressMiddleware
 */

const { query } = require('express-validator');
const { runValidation } = require('@exzly-middlewares');
const { dataDefaultSize, dataQuerySizeMax } = require('@exzly-config');

/**
 * @type {ExpressMiddleware[]}
 */
const dataQuery = [
  query('size')
    .default(dataDefaultSize)
    .if(query('size').exists())
    .isInt({ allow_leading_zeroes: false })
    .withMessage('Size must be an integer')
    .isInt({ min: 1 })
    .withMessage('Size must be greater than or equal to 1')
    .isInt({ max: dataQuerySizeMax })
    .withMessage(`Size cannot exceed ${dataQuerySizeMax}`)
    .toInt(),

  query('skip')
    .default(0)
    .if(query('skip').exists())
    .isInt({ allow_leading_zeroes: false })
    .withMessage('Skip must be an integer')
    .isInt({ min: 0 })
    .withMessage('Skip must be greater than or equal to 0')
    .toInt(),

  query('in-trash')
    .default(false)
    .if(query('in-trash').exists())
    .isBoolean()
    .withMessage('In-trash must be a boolean value')
    .toBoolean(),

  runValidation,
];

/**
 * @type {ExpressMiddleware[]}
 */
const dataTablesQuery = [
  query('order.*.dir')
    .if(query('order').isArray())
    .notEmpty()
    .withMessage('The order direction (order.*.dir) is required')
    .isIn(['asc', 'desc'])
    .withMessage('The order direction must be either "asc" or "desc"'),

  query('order.*.name')
    .if(query('order').isArray())
    .notEmpty()
    .withMessage('The order column name (order.*.name) is required')
    .isString()
    .withMessage('The order column name must be a string'),

  query('columns.*.name')
    .if(query('columns').isArray())
    .notEmpty()
    .withMessage('The column name (columns.*.name) is required')
    .isString()
    .withMessage('The column name must be a string'),

  query('columns.*.search.value')
    .if(query('columns').isArray())
    .optional()
    .isString()
    .withMessage('The column search value (columns.*.search.value) must be a string'),

  query('columns.*.searchable')
    .if(query('columns').isArray())
    .optional()
    .isBoolean()
    .withMessage('The column searchable flag (columns.*.searchable) must be a boolean'),

  query('columns.*.orderable')
    .if(query('columns').isArray())
    .optional()
    .isBoolean()
    .withMessage('The column orderable flag (columns.*.orderable) must be a boolean'),

  runValidation,
];

module.exports = { dataQuery, dataTablesQuery };
