'use client';
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Якщо користувач не авторизований - перенаправити на login
      if (!user) {
        router.push('/login');
        return;
      }

      // Якщо не адмін - перенаправити на сторінку помилки
      if (user.role !== 'ADMIN') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router]);

  // Показати завантаження
  if (loading) {
    return <div>Loading...</div>;
  }

  // Не рендерити дітей, якщо не адмін або не авторизований
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  // Якщо все гаразд - рендерити дітей
  return <>{children}</>;
};

export default ProtectedRoute;