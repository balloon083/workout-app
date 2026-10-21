const HttpError = require('./HttpError');

/** Parses a route `:id` param, rejecting anything that isn't a positive integer. */
function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw HttpError.badRequest('id must be a positive integer');
  }
  return id;
}

module.exports = { parseId };
