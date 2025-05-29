/**
 * API service for handling API requests to the backend
 */
import axiosClient from '@/api/axiosClient';
import { getCachedData, invalidateCache } from './cacheService';

/**
 * Base API Response interface
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  success: boolean;
  metadata?: {
    page?: number;
    total?: number;
    limit?: number;
  };
}

/**
 * Generic GET request handler with caching
 * @param endpoint API endpoint path
 * @param useCache Whether to use cache (default: true)
 * @param cacheTTL Cache time-to-live in milliseconds (default: 5 minutes)
 * @returns Promise with the response data
 */
export const apiGet = async <T>(
  endpoint: string,
  useCache: boolean = true,
  cacheTTL?: number
): Promise<ApiResponse<T>> => {
  console.log(`[ApiService] GET request to ${endpoint}`);

  const fetchData = async (): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosClient.get<ApiResponse<T>>(endpoint);
      console.log(`[ApiService] Response from ${endpoint}:`, response.status);
      return {
        ...response.data,
        success: true,
      };
    } catch (error) {
      console.error(`[ApiService] Error in GET request to ${endpoint}:`, error);
      return {
        data: {} as T,
        error: 'Failed to fetch data',
        success: false,
      };
    }
  };

  if (useCache) {
    return getCachedData<ApiResponse<T>>(
      `GET:${endpoint}`,
      fetchData,
      cacheTTL
    );
  }

  return fetchData();
};

/**
 * Generic POST request handler
 * @param endpoint API endpoint path
 * @param data Request payload
 * @returns Promise with the response data
 */
export const apiPost = async <T, R>(
  endpoint: string,
  data: T
): Promise<ApiResponse<R>> => {
  console.log(`[ApiService] POST request to ${endpoint}`);
  console.log(`[ApiService] Request payload:`, data);

  try {
    const response = await axiosClient.post<ApiResponse<R>>(endpoint, data);
    console.log(`[ApiService] Response from ${endpoint}:`, response.status);

    // Invalidate any cached GET requests that might be affected by this POST
    invalidateCache(`GET:${endpoint.split('/')[1]}`, true);

    return {
      ...response.data,
      success: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[ApiService] Error in POST request to ${endpoint}:`, error);
    return {
      data: {} as R,
      error: error?.response?.data?.message || 'Request failed',
      success: false,
    };
  }
};

/**
 * Generic PUT request handler
 * @param endpoint API endpoint path
 * @param data Request payload
 * @returns Promise with the response data
 */
export const apiPut = async <T, R>(
  endpoint: string,
  data: T
): Promise<ApiResponse<R>> => {
  console.log(`[ApiService] PUT request to ${endpoint}`);

  try {
    const response = await axiosClient.put<ApiResponse<R>>(endpoint, data);
    console.log(`[ApiService] Response from ${endpoint}:`, response.status);

    // Invalidate any cached GET requests that might be affected by this PUT
    invalidateCache(`GET:${endpoint.split('/')[1]}`, true);

    return {
      ...response.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error(`[ApiService] Error in PUT request to ${endpoint}:`, error);
    return {
      data: {} as R,
      error: error instanceof Error ? error.message : 'Request failed',
      success: false,
    };
  }
};

/**
 * Generic DELETE request handler
 * @param endpoint API endpoint path
 * @returns Promise with the response data
 */
export const apiDelete = async <T>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  console.log(`[ApiService] DELETE request to ${endpoint}`);

  try {
    const response = await axiosClient.delete<ApiResponse<T>>(endpoint);
    console.log(`[ApiService] Response from ${endpoint}:`, response.status);

    // Invalidate any cached GET requests that might be affected by this DELETE
    invalidateCache(`GET:${endpoint.split('/')[1]}`, true);

    return {
      ...response.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error(
      `[ApiService] Error in DELETE request to ${endpoint}:`,
      error
    );
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'Request failed',
      success: false,
    };
  }
};
