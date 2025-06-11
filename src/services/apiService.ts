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
      return response.data;
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
    
    // Extract detailed error information
    let errorMessage = 'Request failed';
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.response?.statusText) {
      errorMessage = `${error.response.status}: ${error.response.statusText}`;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    console.error(`[ApiService] Detailed error information:`, {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: errorMessage
    });
    
    return {
      data: {} as R,
      error: errorMessage,
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
  console.log(`[ApiService] PUT request data:`, JSON.stringify(data, null, 2));

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

    // Type guard for axios error
    const isAxiosError = (
      err: unknown
    ): err is {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    if (isAxiosError(error)) {
      console.error(`[ApiService] Error response data:`, error.response?.data);
      console.error(
        `[ApiService] Error response status:`,
        error.response?.status
      );
    }

    return {
      data: {} as R,
      error: isAxiosError(error)
        ? error.response?.data?.message || error.message || 'Request failed'
        : 'Request failed',
      success: false,
    };
  }
};

/**
 * Generic DELETE request handler
 * @param endpoint API endpoint path
 * @param config Optional axios config (for request body in DELETE)
 * @returns Promise with the response data
 */
export const apiDelete = async <T>(
  endpoint: string,
  config?: { data?: unknown }
): Promise<ApiResponse<T>> => {
  console.log(`[ApiService] DELETE request to ${endpoint}`);

  try {
    const response = await axiosClient.delete<ApiResponse<T>>(endpoint, config);
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
