import { getRefreshToken, setAccessToken } from './token';
import apiClient from '../api-client';

/**
 * Refresh JWT access token using refresh token
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken
    }, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = response.data;
    setAccessToken(data.access_token);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

/**
 * Set up automatic token refresh before expiration
 */
export const setupTokenRefresh = (refreshThresholdMinutes = 5): void => {
  const checkAndRefresh = async () => {
    // Check if token needs refresh
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
            const timeUntilExpiration = expirationTime - currentTime;
            const thresholdMs = refreshThresholdMinutes * 60 * 1000;

            // Refresh if expiration is within threshold
            if (timeUntilExpiration < thresholdMs) {
              await refreshToken();
            }
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    }
  };

  // Check every 5 minutes
  setInterval(checkAndRefresh, 5 * 60 * 1000);
};

export default refreshToken;