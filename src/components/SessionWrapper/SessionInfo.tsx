'use client';

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Chip, Tooltip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoopIcon from '@mui/icons-material/Loop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import { getRemainingSessionTime } from '@/services/sessionService';

const SessionInfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0px 5px 12px rgba(0, 0, 0, 0.15)',
  },
}));

interface SessionInfoProps {
  onRefresh: () => void;
  sessionTimeout?: number; // in milliseconds
}

export const SessionInfo: React.FC<SessionInfoProps> = ({
  onRefresh,
  sessionTimeout = 30 * 60 * 1000 // 30 minutes default
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [loginTime, setLoginTime] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Update remaining time every minute
  useEffect(() => {
    // Get initial login time from localStorage
    const lastActivityTime = localStorage.getItem('lastActivityTime');
    if (lastActivityTime) {
      setLoginTime(new Date(parseInt(lastActivityTime)));
    }

    // Update remaining time
    const updateTime = () => {
      const remaining = getRemainingSessionTime(sessionTimeout);
      setRemainingTime(remaining);
    };

    // Update immediately and then every minute
    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, [sessionTimeout]);

  // Handle session refresh
  const handleRefreshSession = () => {
    setRefreshing(true);
    onRefresh();

    // Simulate refresh delay for UI feedback
    setTimeout(() => {
      setRemainingTime(sessionTimeout);
      setRefreshing(false);
    }, 800);
  };

  // Format remaining time as MM:SS
  const formatRemainingTime = (): string => {
    if (remainingTime <= 0) return '00:00';

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format time for display
  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate session health based on remaining time
  const getSessionHealth = (): { status: string; color: string } => {
    const percentRemaining = (remainingTime / sessionTimeout) * 100;

    if (percentRemaining > 50) {
      return { status: 'Healthy', color: 'success' };
    } else if (percentRemaining > 20) {
      return { status: 'Moderate', color: 'warning' };
    } else {
      return { status: 'Expiring Soon', color: 'error' };
    }
  };

  const sessionHealth = getSessionHealth();

  return (
    <SessionInfoPaper elevation={1}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600} display="flex" alignItems="center">
          <SecurityIcon sx={{ mr: 1, fontSize: 20 }} />
          Session Information
        </Typography>
        <Tooltip title="Refresh session">
          <IconButton
            onClick={handleRefreshSession}
            disabled={refreshing}
            sx={{
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          >
            <LoopIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        <Box flex="1" minWidth="140px">
          <Typography variant="body2" color="textSecondary">
            Session Status
          </Typography>
          <Box display="flex" alignItems="center" mt={0.5}>
            <Chip
              label={sessionHealth.status}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              color={sessionHealth.color as any}
              size="small"
              sx={{
                fontWeight: 500,
                borderRadius: '6px',
              }}
            />
          </Box>
        </Box>

        <Box flex="1" minWidth="140px">
          <Typography variant="body2" color="textSecondary">
            Logged In At
          </Typography>
          <Typography variant="body1" display="flex" alignItems="center" mt={0.5}>
            <AccessTimeIcon sx={{ mr: 0.5, fontSize: 16, opacity: 0.7 }} />
            {formatTime(loginTime)}
          </Typography>
        </Box>

        <Box flex="1" minWidth="140px">
          <Typography variant="body2" color="textSecondary">
            Expires In
          </Typography>
          <Typography
            variant="body1"
            fontWeight={500}
            mt={0.5}
            color={
              remainingTime < sessionTimeout * 0.2 ? 'error.main' :
                remainingTime < sessionTimeout * 0.5 ? 'warning.main' :
                  'text.primary'
            }
          >
            {formatRemainingTime()}
          </Typography>
        </Box>
      </Box>
    </SessionInfoPaper>
  );
};
