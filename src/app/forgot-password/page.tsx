'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useToast } from '@/components/UI/ToastNotification';
import { InputField } from '@/components/UI/InputField';
import { Button } from '@/components/UI/Button';
import { authService } from '@/services/authService';
import s from './page.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { showToast } = useToast();

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await authService.requestPasswordReset(email);

      if (response.success) {
        setEmailSent(true);
        showToast('Password reset instructions sent to your email', 'success');
      } else {
        showToast(response.error || 'Something went wrong, please try again', 'error');
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      showToast('Failed to send password reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={s.forgot__password}>
      <Box mt={10} mb={5} display="flex" flexDirection="column" alignItems="center">
        <Paper className={s.forgot__paper} elevation={3}>
          {!emailSent ? (
            <>
              <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
                Reset Your Password
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={4}>
                Enter your email address and we&#39;ll send you instructions to reset your password.
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <InputField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  placeholder="Enter your email"
                  required
                  fullWidth
                />

                <Box mt={4}>
                  <Button
                    label="Send Reset Link"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                    type="submit"
                    fullWidth
                  />
                </Box>
              </form>
            </>
          ) : (
            <>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Typography variant="h5" component="h1" fontWeight={600} gutterBottom textAlign="center">
                  Check Your Email
                </Typography>
                <Typography variant="body1" color="textSecondary" textAlign="center">
                  We&#39;ve sent password reset instructions to <strong>{email}</strong>.
                  Please check your inbox and spam folders.
                </Typography>
              </Box>
              <Button
                label="Back to Login"
                variant="secondary"
                fullWidth
                onClick={() => window.location.href = '/login'}
              />
            </>
          )}

          <Box mt={3} textAlign="center">
            <Link href="/login" passHref>
              <MuiLink underline="hover">
                Return to Login
              </MuiLink>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
