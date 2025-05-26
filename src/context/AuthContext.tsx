'use client';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axiosClient from '@/api/axiosClient';
import UserDataModel from '@/models/UserDataModel';

interface AuthContextType {
  user: UserDataModel | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (token: string, userData: UserDataModel) => void;
  logout: () => void;
  checkUserRole: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDataModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Перевірити авторизацію користувача при завантаженні
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = Cookies.get('accessToken');
        if (storedToken) {
          // Встановити token в axios
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

          // Отримати дані користувача
          try {
            const response = await axiosClient.get('/auth/profile');
            if (response.data) {
              setUser(response.data);
              setToken(storedToken);

              // Перевірити роль користувача
              if (response.data.role !== 'ADMIN') {
                console.log('Not an admin, redirecting');
                router.push('/unauthorized');
              }
            }
          } catch (err) {
            console.error('Failed to fetch user data:', err);
            Cookies.remove('accessToken');
            setUser(null);
            setToken(null);
            router.push('/login');
          }
        } else {
          // Якщо токена немає - перенаправити на сторінку входу
          const pathname = window.location.pathname;
          if (pathname !== '/login' && pathname !== '/register' && pathname !== '/unauthorized') {
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  // Функція для входу
  const login = (newToken: string, userData: UserDataModel) => {
    // Зберегти token в cookie (термін дії 1 день)
    Cookies.set('accessToken', newToken, { expires: 1 });

    // Встановити token в axios
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    setToken(newToken);
    setUser(userData);
    setError(null);
  };

  // Функція для виходу
  const logout = () => {
    Cookies.remove('accessToken');
    delete axiosClient.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  // Функція для перевірки ролі користувача
  const checkUserRole = async (): Promise<boolean> => {
    if (!user) return false;
    return user.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      logout,
      checkUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}