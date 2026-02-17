import { handleAuthError } from '../auth/errors';

/**
 * Handle API errors specifically for the API client
 */
export const handleApiError = (error: any) => {
  // Pass to auth error handler for standard processing
  const authError = handleAuthError(error);

  // Log the error for debugging
  console.error('API Error:', authError);

  // Potentially trigger additional error handling actions
  if (authError.name === 'UnauthorizedError') {
    // Trigger global unauthorized event
    // This could be used to show a modal or redirect
    console.warn('Unauthorized access detected');
  }

  // Re-throw the processed error
  throw authError;
};

/**
 * Specific handler for 401 Unauthorized errors
 */
export const handle401Error = () => {
  // Clear auth tokens
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Specific handler for 403 Forbidden errors
 */
export const handle403Error = () => {
  // Show forbidden access message
  console.warn('Access forbidden');
};

/**
 * Specific handler for network errors
 */
export const handleNetworkError = () => {
  // Show network error message
  console.error('Network error: Unable to connect to server');
};