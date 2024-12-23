'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import s from './page.module.scss';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className={s.loginContainer}>
      <Link href="/" className={s.closeButton}>
        <svg
          className={s.icon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </Link>
      <div className={s.formWrapper}>
        <h1 className={s.title}>Sign in to your account</h1>

        <form className={s.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={s.label}>
              Email Address
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
            />
          </div>
          <div>
            <label htmlFor="password" className={s.label}>
              Password
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
              autoComplete="true"
            />
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

          <button type="submit" className={s.submitButton}>
            Sign in
          </button>

          <p className={s.registerText}>
            Don’t have an account?{' '}
            <Link href={'register'} className={s.signUpLink}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
