'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { InputField } from '@/components/UI/InputField';
import { Button } from '@/components/UI/Button';
import { useToast } from '@/components/UI/ToastNotification';
import { authService } from '@/services/authService';
import s from './page.module.scss';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
    token: '',
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (!token) {
      setErrors((prev) => ({
        ...prev,
        token: 'Invalid or missing reset token',
      }));
    }
  }, [token]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
      token: errors.token,
    };

    if (!token) {
      newErrors.token = 'Invalid or missing reset token';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.confirmPasswordReset({
        token: token!,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        showToast('Password has been reset successfully', 'success');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        showToast(response.error || 'Failed to reset password', 'error');
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      showToast('Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={s.reset__password}>
      <Box
        mt={10}
        mb={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Paper className={s.reset__paper} elevation={3}>
          {!success ? (
            <>
              <Typography
                variant="h5"
                component="h1"
                fontWeight={600}
                gutterBottom
              >
                Reset Your Password
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={4}>
                Please enter your new password below.
              </Typography>

              {errors.token && (
                <Box
                  mb={3}
                  p={2}
                  sx={{ backgroundColor: '#FFF4F4', borderRadius: '8px' }}
                >
                  <Typography color="error">{errors.token}</Typography>
                  <Box mt={1}>
                    <Link href="/forgot-password" passHref>
                      <MuiLink underline="hover">
                        Request a new password reset link
                      </MuiLink>
                    </Link>
                  </Box>
                </Box>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <InputField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                  placeholder="Enter your new password"
                  required
                  fullWidth
                  disabled={!!errors.token}
                />

                <InputField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="Confirm your new password"
                  required
                  fullWidth
                  disabled={!!errors.token}
                />

                <Box mt={4}>
                  <Button
                    label="Reset Password"
                    variant="primary"
                    loading={loading}
                    disabled={loading || !!errors.token}
                    type="submit"
                    fullWidth
                  />
                </Box>
              </form>
            </>
          ) : (
            <>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={600}
                  gutterBottom
                  textAlign="center"
                >
                  Password Reset Successful
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  Your password has been reset successfully. You will be
                  redirected to the login page in a few seconds.
                </Typography>
              </Box>
              <Button
                label="Go to Login"
                variant="primary"
                fullWidth
                onClick={() => router.push('/login')}
              />
            </>
          )}

          <Box mt={3} textAlign="center">
            <Link href="/login" passHref>
              <MuiLink underline="hover">Back to Login</MuiLink>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
