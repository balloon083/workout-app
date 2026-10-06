/** An error that maps directly to an HTTP response status and message. */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static badRequest(message) {
    return new HttpError(400, message);
  }

  static unauthorized(message) {
    return new HttpError(401, message);
  }

  static notFound(message) {
    return new HttpError(404, message);
  }

  static conflict(message) {
    return new HttpError(409, message);
  }
}

module.exports = HttpError;
