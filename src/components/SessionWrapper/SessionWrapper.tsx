'use client';

import React, { ReactNode, useCallback } from 'react';
import { useSessionTimeout, useSessionManager } from '@/services/sessionService';
import { SessionExpiryDialog } from './SessionExpiryDialog';
import { useAuth } from '@/context/AuthContext';

interface SessionWrapperProps {
  children: ReactNode;
  timeout?: number; // Session timeout in milliseconds
}

/**
 * SessionWrapper component
 * Wraps the application with session management functionality
 */
export const SessionWrapper: React.FC<SessionWrapperProps> = ({
  children,
  timeout = 30 * 60 * 1000 // 30 minutes default
}) => {
  // Initialize session timeout handling
  useSessionTimeout(timeout);
  const { logout } = useAuth();
  const { updateLastActivity } = useSessionManager(timeout);

  // Handle extending the session (user clicked "Continue Session")
  const handleExtendSession = useCallback(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // Handle logout (user clicked "Logout" or session expired)
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      {children}

      {/* Session expiry dialog */}
      <SessionExpiryDialog
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
        warningThreshold={5 * 60 * 1000} // Show warning 5 minutes before session expiry
      />
    </>
  );
};
