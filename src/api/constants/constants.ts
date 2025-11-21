/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Response message patterns
 */
export const RESPONSE_MESSAGES = {
  LOGGED_IN_USER_SESSION: 'logged in user session:',
  OK: 'ok',
  INVALID_CREDENTIALS: 'Invalid username/password supplied',
};

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY_MS: 500,
  BACKOFF_MULTIPLIER: 1.5,
};

/**
 * Timeouts (in milliseconds)
 */
export const TIMEOUTS = {
  API_REQUEST: 30000,
  PAGE_LOAD: 30000,
  NAVIGATION: 30000,
};
