class BaseError extends Error {
  constructor(message = 'Unexpected error occurred', statusCode = 500, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.success = false;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = BaseError;
