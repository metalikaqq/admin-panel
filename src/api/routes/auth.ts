import axios from 'axios';
import UserCredentialsModel from '@/models/UserCredentialsModel';
import UserDataModel from '@/models/UserDataModel';
import axiosClient from '../axiosClient';
import Cookies from 'js-cookie';

export interface AuthResponse {
  access_token: string;
  user: UserDataModel;
}

export const signUp = async (
  userData: UserCredentialsModel
): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post<AuthResponse>(
      '/auth/register',
      userData
    );

    // Зберегти токен та оновити заголовки
    if (response.data.access_token) {
      Cookies.set('accessToken', response.data.access_token, { expires: 1 });
      axiosClient.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access_token}`;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error signing up user:',
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || 'Error during registration'
      );
    } else {
      console.error('Unknown error signing up user:', error);
      throw new Error('An unexpected error occurred during registration');
    }
  }
};

export const signIn = async (
  credentials: UserCredentialsModel
): Promise<AuthResponse> => {
  try {
    const response = await axiosClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );

    // Перевірити роль користувача
    if (response.data.user.role !== 'ADMIN') {
      throw new Error('Only administrators can access this application');
    }

    // Зберегти токен та оновити заголовки
    if (response.data.access_token) {
      Cookies.set('accessToken', response.data.access_token, { expires: 1 });
      axiosClient.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access_token}`;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error signing in user:',
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    } else if (error instanceof Error) {
      console.error('Error signing in user:', error.message);
      throw error;
    } else {
      console.error('Unknown error signing in user:', error);
      throw new Error('An unexpected error occurred during login');
    }
  }
};

export const checkAuth = async (): Promise<UserDataModel> => {
  try {
    const response = await axiosClient.get<UserDataModel>('/auth/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Auth check failed:',
        error.response?.data?.message || error.message
      );
    } else {
      console.error('Unknown error during auth check:', error);
    }
    throw error;
  }
};

export const logout = (): void => {
  Cookies.remove('accessToken');
  delete axiosClient.defaults.headers.common['Authorization'];
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
