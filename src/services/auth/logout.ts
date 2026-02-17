import { removeTokens } from './token';
import apiClient from '../api-client';

/**
 * Perform logout operation
 * - Calls backend logout endpoint
 * - Removes all stored authentication data
 * - Handles errors gracefully
 */
export const performLogout = async (): Promise<void> => {
  try {
    // Get refresh token to send to backend
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      // Notify backend about logout (optional)
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        await apiClient.post('/auth/logout', { refresh_token: refreshToken }, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);
      } catch (error) {
        // Even if backend logout fails, continue with local cleanup
        console.error('Backend logout failed:', error);
      }
    }

    // Clear all authentication data from localStorage
    removeTokens();
    localStorage.removeItem('user');

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage even if there's an error
    removeTokens();
    localStorage.removeItem('user');

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Set up automatic logout on token expiration
 */
export const setupAutomaticLogout = (): void => {
  // Check token validity periodically
  const checkTokenValidity = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decode token to check expiration
        const parts = token.split('.');
        if (parts.length === 3) {
          const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const decodedPayload = JSON.parse(atob(base64Payload));

          if (decodedPayload.exp) {
            const expirationTime = decodedPayload.exp * 1000;
            const currentTime = Date.now();

            // If token is expired, perform logout
            if (currentTime > expirationTime) {
              console.warn('Token expired, logging out...');
              performLogout();
            }
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        // If there's an error decoding the token, assume it's invalid and logout
        performLogout();
      }
    }
  };

  // Check every minute
  setInterval(checkTokenValidity, 60 * 1000);
};

export default performLogout;