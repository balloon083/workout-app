const HttpError = require('../utils/HttpError');

function notFound(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
}

// Express 5 forwards errors thrown in async handlers here automatically,
// so controllers can just `throw` instead of wrapping everything in try/catch.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Errors raised by Express itself, e.g. a malformed JSON body.
  if (err.status && err.status < 500 && err.expose) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
}

module.exports = { notFound, errorHandler };
