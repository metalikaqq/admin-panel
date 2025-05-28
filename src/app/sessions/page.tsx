'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/UI/ToastNotification';
import { ConfirmationDialog } from '@/components/UI/ConfirmationDialog';
import { Button } from '@/components/UI/Button';
import { Pagination } from '@/components/UI/Pagination';
import s from './page.module.scss';

// Mock session data (replace with actual API call when backend supports it)
interface UserSession {
  id: string;
  userId: string;
  username: string;
  email: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  loginTime: string;
  lastActive: string;
  isActive: boolean;
}

export default function SessionsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<UserSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sessionsPerPage] = useState(10);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [terminateLoading, setTerminateLoading] = useState(false);
  const [stats, setStats] = useState({
    activeSessions: 0,
    uniqueUsers: 0,
    mobileDevices: 0
  });

  // Load user sessions
  useEffect(() => {
    loadSessions();
    // loadSessions doesn't depend on any props or state, so this is safe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter sessions when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSessions(sessions);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = sessions.filter(session =>
      session.username.toLowerCase().includes(searchLower) ||
      session.email.toLowerCase().includes(searchLower) ||
      session.ip.includes(searchQuery) ||
      session.device.toLowerCase().includes(searchLower)
    );

    setFilteredSessions(filtered);
    setPage(1); // Reset to first page when filtering
  }, [searchQuery, sessions, setPage]);

  // Update stats when sessions change
  useEffect(() => {
    if (sessions.length === 0) return;

    // Count active sessions
    const activeSessions = sessions.filter(session => session.isActive).length;

    // Count unique users
    const uniqueUserIds = new Set(sessions.map(session => session.userId));

    // Count mobile devices
    const mobileDevices = sessions.filter(session =>
      session.device.toLowerCase().includes('mobile') ||
      session.device.toLowerCase().includes('phone') ||
      session.device.toLowerCase().includes('tablet')
    ).length;

    setStats({
      activeSessions,
      uniqueUsers: uniqueUserIds.size,
      mobileDevices
    });
  }, [sessions, setStats]);

  // Load sessions from API
  const loadSessions = async () => {
    setLoading(true);
    try {
      // Replace with actual API call when backend supports it
      // const response = await userService.getAllSessions();

      // Mock data for now
      const mockSessions = generateMockSessions(25);
      setTimeout(() => {
        setSessions(mockSessions);
        setFilteredSessions(mockSessions);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      showToast('Failed to load user sessions', 'error');
      setLoading(false);
    }
  };

  // Generate mock session data
  const generateMockSessions = (count: number): UserSession[] => {
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const oses = ['Windows 10', 'macOS', 'Ubuntu', 'iOS', 'Android'];
    const devices = ['Desktop', 'Laptop', 'iPhone', 'Android Phone', 'iPad', 'Android Tablet'];

    return Array.from({ length: count }, (_, i) => {
      const isActive = Math.random() > 0.2;
      const loginDate = new Date();
      loginDate.setHours(loginDate.getHours() - Math.floor(Math.random() * 24));

      const lastActiveDate = new Date(loginDate);
      if (isActive) {
        lastActiveDate.setMinutes(lastActiveDate.getMinutes() + Math.floor(Math.random() * 60));
      }

      return {
        id: `sess_${i}_${Date.now()}`,
        userId: `user_${i % 5}`,
        username: `user${i % 5}`,
        email: `user${i % 5}@example.com`,
        ip: `192.168.1.${i % 255}`,
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: oses[Math.floor(Math.random() * oses.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        loginTime: loginDate.toISOString(),
        lastActive: lastActiveDate.toISOString(),
        isActive
      };
    });
  };

  // Handle session termination
  const handleTerminateSession = async () => {
    if (!selectedSession) return;

    setTerminateLoading(true);
    try {
      // Replace with actual API call when backend supports it
      // await userService.terminateSession(selectedSession);

      // Mock successful termination
      setTimeout(() => {
        setSessions(prevSessions =>
          prevSessions.map(session =>
            session.id === selectedSession
              ? { ...session, isActive: false }
              : session
          )
        );

        showToast('Session terminated successfully', 'success');
        setTerminateLoading(false);
        setConfirmDialogOpen(false);
        setSelectedSession(null);
      }, 800);
    } catch (error) {
      console.error('Failed to terminate session:', error);
      showToast('Failed to terminate session', 'error');
      setTerminateLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  // Handle confirmation dialog open
  const confirmTerminate = (sessionId: string) => {
    setSelectedSession(sessionId);
    setConfirmDialogOpen(true);
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Time difference between login and last active
  const getActiveDuration = (login: string, lastActive: string): string => {
    const loginDate = new Date(login);
    const lastActiveDate = new Date(lastActive);
    const diffMs = lastActiveDate.getTime() - loginDate.getTime();

    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Pagination logic
  const indexOfLastSession = page * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You do not have permission to view this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={s.sessions__page}>
      <Box mb={3}>
        <Typography variant="h4" component="h1">
          User Sessions Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitor and manage active user sessions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography color="textSecondary" variant="subtitle1" gutterBottom>
                  Active Sessions
                </Typography>
                <Typography variant="h4" component="div">
                  {loading ? <CircularProgress size={20} /> : stats.activeSessions}
                </Typography>
              </Box>
              <PersonIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography color="textSecondary" variant="subtitle1" gutterBottom>
                  Unique Users
                </Typography>
                <Typography variant="h4" component="div">
                  {loading ? <CircularProgress size={20} /> : stats.uniqueUsers}
                </Typography>
              </Box>
              <SecurityIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography color="textSecondary" variant="subtitle1" gutterBottom>
                  Mobile Devices
                </Typography>
                <Typography variant="h4" component="div">
                  {loading ? <CircularProgress size={20} /> : stats.mobileDevices}
                </Typography>
              </Box>
              <DevicesIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by username, email, IP..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />

        <Button
          label="Refresh"
          variant="secondary"
          loading={loading}
          icon={<RefreshIcon />}
          onClick={loadSessions}
        />
      </Box>

      {/* Sessions Table */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Device / Browser</TableCell>
                <TableCell>Login Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Loading sessions...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : currentSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No sessions found
                    </Typography>
                    {searchQuery && (
                      <Typography variant="body2" color="textSecondary">
                        Try adjusting your search criteria
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                currentSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {session.username}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {session.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{session.ip}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{session.device}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {session.browser} / {session.os}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(session.loginTime)}</TableCell>
                    <TableCell>
                      {getActiveDuration(session.loginTime, session.lastActive)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.isActive ? "Active" : "Inactive"}
                        color={session.isActive ? "success" : "default"}
                        size="small"
                        sx={{ borderRadius: '6px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        size="small"
                        disabled={!session.isActive}
                        onClick={() => confirmTerminate(session.id)}
                      >
                        <LogoutIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && filteredSessions.length > sessionsPerPage && (
          <Box py={2} display="flex" justifyContent="center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Box>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Terminate Session"
        message="Are you sure you want to terminate this user session? The user will be logged out immediately."
        confirmLabel="Terminate"
        onConfirm={handleTerminateSession}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setSelectedSession(null);
        }}
        confirmVariant="danger"
        loading={terminateLoading}
      />
    </Container>
  );
}
