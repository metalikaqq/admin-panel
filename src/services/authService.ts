import { apiPost, apiGet, ApiResponse } from '@/services/apiService';
import {
  PasswordChangeRequest,
  PasswordResetRequest,
  PasswordResetConfirmation,
  UserModel,
  CreateUserRequest,
} from '@/models/UserModel';
import Cookies from 'js-cookie';
import axiosClient from '@/api/axiosClient';

interface AuthResponseData {
  access_token: string;
  user: UserModel;
}

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Service for authentication operations
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async (
    userData: CreateUserRequest
  ): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiPost<
      CreateUserRequest,
      ApiResponse<AuthResponseData>
    >('/auth/register', userData);

    if (response.success && response.data?.access_token) {
      // Store token in cookies
      Cookies.set('accessToken', response.data.access_token, { expires: 1 });

      // Set authorization header for future requests
      axiosClient.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access_token}`;
    }

    return response;
  },

  /**
   * Login user
   */
  login: async (
    credentials: LoginRequest
  ): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiPost<LoginRequest, ApiResponse<AuthResponseData>>(
      '/auth/login',
      credentials
    );

    if (response.success && response.data?.access_token) {
      // Store token in cookies
      Cookies.set('accessToken', response.data.access_token, { expires: 1 });

      // Set authorization header for future requests
      axiosClient.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access_token}`;
    }

    return response;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<UserModel>> => {
    return apiGet<ApiResponse<UserModel>>('/auth/profile');
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (
    email: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const payload: PasswordResetRequest = { email };
    return apiPost<PasswordResetRequest, ApiResponse<{ message: string }>>(
      '/auth/password-reset',
      payload
    );
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset: async (
    data: PasswordResetConfirmation
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiPost<PasswordResetConfirmation, ApiResponse<{ message: string }>>(
      '/auth/password-reset/confirm',
      data
    );
  },

  /**
   * Change user password
   */
  changePassword: async (
    data: PasswordChangeRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiPost<PasswordChangeRequest, ApiResponse<{ message: string }>>(
      '/auth/change-password',
      data
    );
  },

  /**
   * Logout user
   */
  logout: (): void => {
    // Remove token from cookies
    Cookies.remove('accessToken');

    // Remove authorization header
    delete axiosClient.defaults.headers.common['Authorization'];
  },
};
