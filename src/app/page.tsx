'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <div>
        <p>User Role: {user?.role}</p>
        <p>User ID: {user?.id}</p>
      </div>

      <div className="dashboard-content">
        <p>This is the admin dashboard. Only admins can see this page.</p>
      </div>

      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

// Обгортаємо компонент в ProtectedRoute
export default function ProtectedHomePage() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}