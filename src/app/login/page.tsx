'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import s from './page.module.scss';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import { Alert, Box } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [sessionTimeoutMessage, setSessionTimeoutMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Check for existing session and session timeout
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      router.push('/');
    }

    // Check if session timed out
    const sessionTimedOut = sessionStorage.getItem('sessionTimedOut');
    if (sessionTimedOut === 'true') {
      setSessionTimeoutMessage('Your session has expired. Please log in again.');
      sessionStorage.removeItem('sessionTimedOut');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSessionTimeoutMessage('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const { access_token, user } = response.data;

        if (user.role !== 'ADMIN') {
          setError('Access denied. Only administrators can log in.');
          setLoading(false);
          return;
        }

        // Save user data in AuthContext
        login(access_token, user);
        setSuccess(true);

        // Store initial activity timestamp for session management
        localStorage.setItem('lastActivityTime', Date.now().toString());

        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        setError(response.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.loginContainer}>
      <div className={s.formWrapper}>
        <h1 className={s.title}>ADMIN LOGIN</h1>

        {sessionTimeoutMessage && (
          <Box mb={3}>
            <Alert severity="warning">{sessionTimeoutMessage}</Alert>
          </Box>
        )}

        <form className={s.form} onSubmit={handleSubmit}>
          <div>
            <div className={s.inputContainer}>
              <label htmlFor="email" className={s.label}>
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={s.input}
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className={s.inputContainer}>
              <label htmlFor="password" className={s.label}>
                PASSWORD
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={s.input}
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>
          <div className={s.flexContainer}>
            <div className={s.flexStart}>
              <input
                id="showPassword"
                type="checkbox"
                className={s.checkbox}
                checked={showPass}
                onChange={() => setShowPass(!showPass)}
              />
              <label htmlFor="showPassword" className={s.rememberMe}>
                Show Password
              </label>
            </div>
            <Link href="/forgot-password" className={s.forgotPassword}>
              Forgot password?
            </Link>
          </div>
          {error && <p className={s.errorMessage}>{error}</p>}
          {success && <p className={s.successMessage}>Login successful!</p>}
          <button type="submit" className={s.submitButton} disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
