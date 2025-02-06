const fs = require('fs');
const path = require('path');

/**
 * Reads and parses the package.json file from the current working directory.
 *
 * @returns {object} The parsed content of the package.json file.
 * @throws {Error} If the package.json file cannot be read or parsed.
 */
const getPackageJSON = () => {
  const packageJSON = fs.readFileSync(path.join(process.cwd(), 'package.json'));
  return JSON.parse(packageJSON.toString());
};

/**
 * Create URL
 *
 * @param {import('express').Request} req
 * @param {'web'|'api'|'admin'} name
 * @param {string} path
 * @returns {string}
 */
const createURL = (req, name, path = '') => {
  let url = `${req.protocol}://${req.get('host')}`;

  switch (name) {
    case 'web':
      url = `${url}${process.env.WEB_ROUTE}${path}`.replace(/\/{2,}/g, '/');
      break;

    case 'api':
      url = `${url}${process.env.API_ROUTE}${path}`.replace(/\/{2,}/g, '/');
      break;

    case 'admin':
      url = `${url}${process.env.ADMIN_ROUTE}${path}`.replace(/\/{2,}/g, '/');
      break;
  }

  return url.replace(/\/{2,}/g, '/');
};

/**
 * Create route
 *
 * @param {'web'|'api'|'admin'} routeName
 * @param {string} routePath
 * @returns {string}
 */
const createRoute = (routeName, routePath = '') => {
  let route;
  switch (routeName) {
    case 'web':
      route = process.env.WEB_ROUTE + routePath;
      break;

    case 'api':
      route = process.env.API_ROUTE + routePath;
      break;

    case 'admin':
      route = process.env.ADMIN_ROUTE + routePath;
      break;
  }

  return route.replace(/\/{2,}/g, '/');
};

module.exports = {
  getPackageJSON,
  createURL,
  createRoute,
};
