/* eslint-disable no-console */
function logErrors(err, req, res, next) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
    console.error(err.stack);
  }
  next(err);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (res.statusCode === 400) {
    res.sendStatus(400);
  }
  res.sendStatus(500);
}

module.exports = { logErrors, errorHandler };
