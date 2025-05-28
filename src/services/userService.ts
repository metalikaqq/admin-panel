import {
  UserModel,
  UserRole,
  UpdateProfileRequest,
  UpdateRoleRequest,
} from '@/models/UserModel';
import { apiGet, apiPut, apiDelete, ApiResponse } from '@/services/apiService';

/**
 * Service for user management operations
 */
export const userService = {
  /**
   * Get all users (admin only)
   */
  getAllUsers: async (
    page = 1,
    limit = 10,
    search?: string
  ): Promise<ApiResponse<UserModel[]>> => {
    let endpoint = `/users?page=${page}&limit=${limit}`;
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return apiGet<ApiResponse<UserModel[]>>(endpoint);
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<ApiResponse<UserModel>> => {
    return apiGet<ApiResponse<UserModel>>(`/users/${id}`);
  },

  /**
   * Update user role (admin only)
   */
  updateUserRole: async (
    userId: string,
    role: UserRole
  ): Promise<ApiResponse<UserModel>> => {
    const payload: UpdateRoleRequest = { role };
    return apiPut<UpdateRoleRequest, ApiResponse<UserModel>>(
      `/users/${userId}/role`,
      payload
    );
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    userId: string,
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UserModel>> => {
    return apiPut<UpdateProfileRequest, ApiResponse<UserModel>>(
      `/users/${userId}`,
      data
    );
  },

  /**
   * Delete user (admin only)
   */
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    return apiDelete<ApiResponse<void>>(`/users/${userId}`);
  },
};
