/**
 * Custom error classes for authentication-related errors
 */

/**
 * Base authentication error class
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Error thrown when credentials are invalid
 */
export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Invalid email or password') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

/**
 * Error thrown when user is not found
 */
export class UserNotFoundError extends AuthError {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Error thrown when email is already registered
 */
export class EmailAlreadyExistsError extends AuthError {
  constructor(message: string = 'Email already registered') {
    super(message);
    this.name = 'EmailAlreadyExistsError';
  }
}

/**
 * Error thrown when token is invalid or expired
 */
export class TokenError extends AuthError {
  constructor(message: string = 'Invalid or expired token') {
    super(message);
    this.name = 'TokenError';
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends AuthError {
  constructor(message: string = 'Network error: Unable to reach server') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends AuthError {
  public errors: Array<{ field: string; message: string }>;

  constructor(errors: Array<{ field: string; message: string }>) {
    const message = errors.map(err => `${err.field}: ${err.message}`).join(', ');
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Error thrown when user is not authorized
 */
export class UnauthorizedError extends AuthError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Generic function to handle API response errors and throw appropriate error types
 */
export const handleAuthError = (error: any): AuthError => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        // Validation error
        if (data.details && Array.isArray(data.details)) {
          return new ValidationError(data.details);
        }
        return new AuthError(data.message || 'Bad request');

      case 401:
        // Unauthorized
        return new UnauthorizedError(data.message || 'Unauthorized');

      case 404:
        // User not found
        return new UserNotFoundError(data.message || 'User not found');

      case 409:
        // Conflict (e.g., email already exists)
        return new EmailAlreadyExistsError(data.message || 'Email already exists');

      case 422:
        // Validation error (alternative)
        if (data.detail && Array.isArray(data.detail)) {
          const errors = data.detail.map((item: any) => ({
            field: item.loc ? item.loc.join('.') : 'unknown',
            message: item.msg || 'Invalid value'
          }));
          return new ValidationError(errors);
        }
        return new AuthError(data.message || 'Validation error');

      case 500:
        // Internal server error
        return new AuthError(data.message || 'Internal server error');

      default:
        return new AuthError(data.message || `HTTP ${status} error`);
    }
  } else if (error.request) {
    // Request was made but no response received
    return new NetworkError();
  } else {
    // Something else happened
    return new AuthError(error.message || 'An unexpected error occurred');
  }
};