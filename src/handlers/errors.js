/* eslint-disable no-console */
const { formatObject } = require('../helpers/apiObjectFormatter');

function logErrors(err, _req, _res, next) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
    console.error(err.stack);
  } else {
    // console.error(err.stack);
  }
  next(err);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (res.statusCode.toString().startsWith('4')) {
    res.json(formatObject(err, null, res.statusCode));
  }
  res.statusCode = 500;
  res.json(formatObject(new Error('Internal error'), null, 500));
}

module.exports = { logErrors, errorHandler };
