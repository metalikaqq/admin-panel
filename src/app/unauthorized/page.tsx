'use client';
import React from 'react';
import s from './page.module.scss';
import { logout } from '@/api/routes/auth';

const Unauthorized = () => {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={s.unauthorizedContainer}>
      <div className={s.contentWrapper}>
        <h1 className={s.title}>Access Denied</h1>
        <p className={s.message}>
          You do not have administrator permissions to access this application.
        </p>
        <div className={s.buttonContainer}>
          <button onClick={handleLogout} className={s.logoutButton}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;