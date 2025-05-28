/**
 * Session management service
 * Handles user session tracking, timeout, and automatic logout
 */

import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';

// Default session timeout in milliseconds (30 minutes)
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;

// Session storage key
const SESSION_ACTIVITY_KEY = 'lastActivityTime';

/**
 * Tracks user activity and handles session timeout
 * @param sessionTimeout - Session timeout in milliseconds (default: 30 minutes)
 */
export const useSessionManager = (sessionTimeout = DEFAULT_SESSION_TIMEOUT) => {
  const { logout } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update last activity time
  const updateLastActivity = () => {
    localStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString());
    resetTimeout();
  };

  // Reset timeout timer
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Check if session has expired
      const lastActivity = Number(localStorage.getItem(SESSION_ACTIVITY_KEY));
      const currentTime = Date.now();

      if (currentTime - lastActivity >= sessionTimeout) {
        handleSessionTimeout();
      }
    }, sessionTimeout);
  };

  // Handle session timeout - logout user and show message
  const handleSessionTimeout = () => {
    localStorage.removeItem(SESSION_ACTIVITY_KEY);

    // Only logout if user was previously logged in (has token)
    const token = Cookies.get('accessToken');
    if (token) {
      logout();

      // Set flag to show session timeout message on login page
      sessionStorage.setItem('sessionTimedOut', 'true');
    }
  };

  // Check session validity
  const checkSession = () => {
    const lastActivity = Number(localStorage.getItem(SESSION_ACTIVITY_KEY));
    const currentTime = Date.now();

    if (lastActivity && currentTime - lastActivity >= sessionTimeout) {
      handleSessionTimeout();
      return false;
    }
    return true;
  };

  // Setup activity listeners
  useEffect(() => {
    // Initial activity update
    updateLastActivity();

    // Track user activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];

    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleUserActivity);
    });

    // Set interval to periodically check session validity
    const intervalCheck = setInterval(checkSession, 60000); // Check every minute

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(intervalCheck);

      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
    // We intentionally only want this to run once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    updateLastActivity,
    checkSession,
  };
};

/**
 * Helper hook for components that need session management
 * Simple wrapper that implements useSessionManager and returns nothing
 */
export const useSessionTimeout = (sessionTimeout = DEFAULT_SESSION_TIMEOUT) => {
  useSessionManager(sessionTimeout);
};

/**
 * Get remaining session time in milliseconds
 * @returns Remaining session time in milliseconds
 */
export const getRemainingSessionTime = (
  sessionTimeout = DEFAULT_SESSION_TIMEOUT
): number => {
  const lastActivity = Number(localStorage.getItem(SESSION_ACTIVITY_KEY));
  if (!lastActivity) return 0;

  const currentTime = Date.now();
  const elapsedTime = currentTime - lastActivity;
  const remainingTime = sessionTimeout - elapsedTime;

  return Math.max(0, remainingTime);
};

/**
 * Get session start time
 * @returns Session start time as Date object or null if not available
 */
export const getSessionStartTime = (): Date | null => {
  const lastActivity = localStorage.getItem(SESSION_ACTIVITY_KEY);
  return lastActivity ? new Date(parseInt(lastActivity)) : null;
};
