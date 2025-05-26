'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import s from './page.module.scss';
import { signIn } from '@/api/routes/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Перевірка, чи вже авторизований користувач
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await signIn({ email, password });

      if (response.access_token && response.user) {
        if (response.user.role !== 'ADMIN') {
          setError('Access denied. Only administrators can log in.');
          setLoading(false);
          return;
        }

        // Зберегти дані користувача в AuthContext
        login(response.access_token, response.user);

        setSuccess(true);

        // Перенаправлення на головну сторінку
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        setError('Login failed. Please check your credentials and try again.');
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
