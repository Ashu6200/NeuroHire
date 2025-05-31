const ApplicationEnvironment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};
const responseMessage = {
  SUCCESS: 'Success',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  VALIDATION_ERROR: 'Validation failed',
  CONFLICT: 'Conflict: resource already exists',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  GATEWAY_TIMEOUT: 'Gateway timeout',
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Invalid email or password',
  LOGOUT_SUCCESS: 'Logout successful',
  ACCOUNT_LOCKED: 'Account is locked',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Token is invalid',
  ACCESS_GRANTED: 'Access granted',
  ACCESS_DENIED: 'Access denied',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_REGISTERED: 'User registered successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_TOO_LARGE: 'File is too large',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported media type'
};

const statusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};
module.exports = { ApplicationEnvironment, responseMessage, statusCode };
