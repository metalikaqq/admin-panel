'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  LinearProgress,
  Typography
} from '@mui/material';
import { Button } from '@/components/UI/Button';
import { getRemainingSessionTime } from '@/services/sessionService';

interface SessionExpiryDialogProps {
  onExtendSession: () => void;
  onLogout: () => void;
  warningThreshold: number; // Time in milliseconds before expiry to show warning (default: 5 minutes)
}

export const SessionExpiryDialog: React.FC<SessionExpiryDialogProps> = ({
  onExtendSession,
  onLogout,
  warningThreshold = 5 * 60 * 1000 // 5 minutes
}) => {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(warningThreshold);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes (should match the timeout in sessionService)

  useEffect(() => {
    // Check session time periodically (every minute)
    const checkSessionTime = () => {
      const remainingTime = getRemainingSessionTime(sessionTimeout);

      // If session is about to expire, show the dialog
      if (remainingTime > 0 && remainingTime <= warningThreshold) {
        setOpen(true);
        setCountdown(remainingTime);
        startCountdown(remainingTime);
      }
    };

    // Check immediately and then every minute
    checkSessionTime();
    const intervalId = setInterval(checkSessionTime, 60000);

    return () => {
      clearInterval(intervalId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [warningThreshold]);

  // Start countdown timer when dialog opens
  const startCountdown = (initialTime: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const updateInterval = 1000; // update every second
    const startTime = Date.now();
    const endTime = startTime + initialTime;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        // Session expired - call logout
        onLogout();
        return;
      }

      setCountdown(remaining);
      // Calculate progress percentage
      const newProgress = (remaining / warningThreshold) * 100;
      setProgress(newProgress);
    }, updateInterval);
  };

  const handleExtendSession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onExtendSession();
    setOpen(false);
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleExtendSession}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          width: { xs: '90%', sm: '450px' }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Session About to Expire
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          <Typography variant="body1" gutterBottom>
            Your session will expire soon due to inactivity. Would you like to continue working?
          </Typography>

          <Box mt={3} mb={1}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="textSecondary">Session expires in:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatTime(countdown)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progress < 30 ? 'error.main' : 'primary.main'
                }
              }}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          label="Logout"
          variant="secondary"
          onClick={onLogout}
        />
        <Button
          label="Continue Session"
          variant="primary"
          onClick={handleExtendSession}
          autoFocus
        />
      </DialogActions>
    </Dialog>
  );
};
