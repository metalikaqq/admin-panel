// pages/account.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { UserModel, UserRole } from '@/models/UserModel';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useSessionManager } from '@/services/sessionService';
import { Button } from '@/components/UI/Button';
import { InputField } from '@/components/UI/InputField';
import { ConfirmationDialog } from '@/components/UI/ConfirmationDialog';
import { ProfileImage } from '@/components/UI/ProfileImage';
import { Pagination } from '@/components/UI/Pagination';
import { SessionInfo } from '@/components/SessionWrapper/SessionInfo';
import { useToast } from '@/components/UI/ToastNotification';
import s from './page.module.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component for tab content
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AccountPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserModel[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile edit states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          const userData = response.data;
          setUsername(userData.username || '');
          setProfileEmail(userData.email || '');
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setProfileImage(userData.profileImage || '');
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        showToast('Failed to load user profile', 'error');
      }
    };

    loadUserProfile();
  }, [showToast]);

  // Load all users for admin
  useEffect(() => {
    const loadUsers = async () => {
      if (user?.role !== 'ADMIN') return;

      setUsersLoading(true);
      try {
        const response = await userService.getAllUsers(page, 10);
        if (response.success && response.data) {
          setAllUsers(response.data);
          // Set total users count from metadata
          if (response.metadata?.total) {
            setTotalUsers(response.metadata.total);
          } else {
            // Fallback if metadata is not available
            setTotalUsers(response.data.length * 2); // Just a fallback assumption
          }
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        showToast('Failed to load users list', 'error');
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [user, page, showToast]);

  // Handle password reset request
  const handlePasswordChangeRequest = async () => {
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(email);
      if (response.success) {
        showToast(
          'Password reset email sent. Please check your inbox.',
          'success'
        );
        setEmail('');
      } else {
        showToast(response.error || 'Failed to send reset email', 'error');
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      showToast('Failed to send password reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const response = await userService.updateUserRole(userId, newRole);
      if (response.success) {
        showToast(`User role updated successfully`, 'success');

        // Update user in the list
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        showToast(response.error || 'Failed to update user role', 'error');
      }
    } catch (error) {
      console.error('Role update failed:', error);
      showToast('Failed to update user role', 'error');
    }
  };

  // Password change validation
  const validatePasswordForm = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  // Handle password change submission
  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) return;

    setProfileLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        showToast('Password changed successfully', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(response.error || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      showToast('Failed to change password', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Delete user confirmation
  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  // Delete user action
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await userService.deleteUser(userToDelete);
      if (response.success) {
        setAllUsers((users) =>
          users.filter((user) => user.id !== userToDelete)
        );
        showToast('User deleted successfully', 'success');
      } else {
        showToast(response.error || 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('User deletion failed:', error);
      showToast('Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) return;

    // Validate input fields
    if (!username.trim()) {
      showToast('Username is required', 'error');
      return;
    }

    if (!profileEmail.trim()) {
      showToast('Email is required', 'error');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      const updateData = {
        firstName,
        lastName,
        username,
        email: profileEmail,
        profileImage,
      };

      const response = await userService.updateProfile(user.id, updateData);

      if (response.success) {
        // Update auth context with new profile data
        // This would typically be handled by a context update function
        showToast('Profile updated successfully', 'success');

        // Refresh session with new user data
        updateLastActivity();
      } else {
        showToast(response.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Session management hooks
  const { updateLastActivity } = useSessionManager();

  // Handle session refresh
  const handleRefreshSession = () => {
    updateLastActivity();
  };

  return (
    <Container maxWidth="lg" className={s.account__page}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" className={s.account__title}>
          Account Settings
        </Typography>
      </Box>

      {/* Session info panel */}
      <SessionInfo onRefresh={handleRefreshSession} />

      {user && (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="account tabs"
              variant="fullWidth"
            >
              <Tab
                label="Profile"
                id="account-tab-0"
                aria-controls="account-tabpanel-0"
              />
              <Tab
                label="Security"
                id="account-tab-1"
                aria-controls="account-tabpanel-1"
              />
              {user.role === 'ADMIN' && (
                <Tab
                  label="User Management"
                  id="account-tab-2"
                  aria-controls="account-tabpanel-2"
                />
              )}
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={4}
            >
              <ProfileImage
                currentImage={profileImage}
                username={username}
                onImageChange={(imageUrl) => setProfileImage(imageUrl)}
                cloudName="admin-panel-cloud" // Updated with actual cloud name
                uploadPreset="admin_panel_preset" // Updated with actual upload preset
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="First Name"
                  value={firstName}
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Last Name"
                  value={lastName}
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  label="Username"
                  value={username}
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  label="Email"
                  type="email"
                  value={profileEmail}
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setProfileEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    label="Update Profile"
                    variant="primary"
                    loading={profileLoading}
                    onClick={handleProfileUpdate}
                  />
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InputField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setCurrentPassword(e.target.value)}
                    error={passwordErrors.currentPassword}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setNewPassword(e.target.value)}
                    error={passwordErrors.newPassword}
                    required
                    helpText="Password must be at least 8 characters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setConfirmPassword(e.target.value)}
                    error={passwordErrors.confirmPassword}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      label="Change Password"
                      variant="primary"
                      loading={profileLoading}
                      onClick={handlePasswordChange}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Reset Password via Email
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      label="Request Password Reset"
                      variant="secondary"
                      loading={loading}
                      onClick={handlePasswordChangeRequest}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* User Management Tab (Admin only) */}
          {user.role === 'ADMIN' && (
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Manage Users
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <table className={s.account__table}>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Box display="flex" gap={1} flexWrap="nowrap">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as UserRole
                                )
                              }
                              className={s.account__select}
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                            <Button
                              label="Delete"
                              variant="danger"
                              onClick={() => confirmDeleteUser(user.id)}
                            />
                          </Box>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usersLoading && (
                  <Box display="flex" justifyContent="center" py={3}>
                    <CircularProgress />
                  </Box>
                )}

                {!usersLoading && allUsers.length === 0 && (
                  <Box textAlign="center" py={3}>
                    <Typography variant="body1" color="textSecondary">
                      No users found
                    </Typography>
                  </Box>
                )}

                {/* Pagination */}
                {totalUsers > 10 && (
                  <Box mt={2}>
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(totalUsers / 10)}
                      onPageChange={(newPage) => setPage(newPage)}
                    />
                  </Box>
                )}
              </Box>
            </TabPanel>
          )}
        </Paper>
      )}

      {/* Delete User Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteUser}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </Container>
  );
}
