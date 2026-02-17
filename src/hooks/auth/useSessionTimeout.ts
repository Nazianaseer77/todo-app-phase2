import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../contexts/auth';

interface SessionTimeoutOptions {
  timeoutDuration?: number; // Duration in milliseconds (default: 30 minutes)
  warningDuration?: number; // Warning duration in milliseconds (default: 1 minute)
  onTimeout?: () => void;
  onWarning?: () => void;
  onReset?: () => void;
}

/**
 * Custom hook to handle session timeout
 * Tracks user activity and warns before session expires
 */
export const useSessionTimeout = ({
  timeoutDuration = 30 * 60 * 1000, // 30 minutes
  warningDuration = 1 * 60 * 1000, // 1 minute
  onTimeout,
  onWarning,
  onReset
}: SessionTimeoutOptions = {}) => {
  const { logout } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Function to handle timeout
  const handleTimeout = useCallback(() => {
    if (onTimeout) onTimeout();
    logout();
  }, [logout, onTimeout]);

  // Function to reset the timeout
  const resetTimeout = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set new warning timeout (trigger warning before actual timeout)
    warningTimeoutRef.current = setTimeout(() => {
      if (onWarning) onWarning();
    }, timeoutDuration - warningDuration);

    // Set actual timeout
    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutDuration);

    if (onReset) onReset();
  }, [handleTimeout, onReset, onWarning, timeoutDuration, warningDuration]);

  // Function to handle user activity
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only reset if enough time has passed to avoid constant resets during activity
    if (timeSinceLastActivity > 1000) {
      resetTimeout();
    }
  }, [resetTimeout]);

  // Function to force logout
  const forceLogout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    handleTimeout();
  };

  // Effect to set up event listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [handleUserActivity, resetTimeout]);

  return { resetTimeout, forceLogout };
};