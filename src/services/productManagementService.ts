/**
 * Product management service for handling product-related API calls
 */
import {
  ProductModel,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductType,
} from '@/models/ProductModel';
import { apiGet, apiPost, apiPut, apiDelete, ApiResponse } from './apiService';

// Base API endpoint for products
const PRODUCTS_ENDPOINT = '/products';
const PRODUCT_TYPES_ENDPOINT = '/product-types';

// Search and filter interfaces
export interface ProductSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  productTypeId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface BulkDeleteRequest {
  productIds: string[];
}

export interface ProductStatistics {
  totalProducts: number;
  totalProductTypes: number;
  recentProducts: number;
  averageImagesPerProduct: number;
}

/**
 * Get all products with pagination, search, and filters
 * @param params Search and pagination parameters
 * @returns Promise with products list and pagination metadata
 */
export const getAllProducts = async (
  params: ProductSearchParams = {}
): Promise<ApiResponse<ProductModel[] | ProductListResponse>> => {
  const { page = 1, limit = 10, search, productTypeId } = params;

  let queryParams = `page=${page}&limit=${limit}`;

  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  if (productTypeId) {
    queryParams += `&productTypeId=${productTypeId}`;
  }

  return await apiGet<ProductModel[] | ProductListResponse>(
    `${PRODUCTS_ENDPOINT}?${queryParams}`,
    false // Temporarily disable caching to debug
  );
};

/**
 * Get product statistics
 * @returns Promise with product statistics
 */
export const getProductStatistics = async (): Promise<
  ApiResponse<ProductStatistics>
> => {
  return await apiGet<ProductStatistics>(`${PRODUCTS_ENDPOINT}/statistics`);
};

/**
 * Get a specific product by ID
 * @param productId Product ID
 * @returns Promise with product data
 */
export const getProductById = async (
  productId: string
): Promise<ApiResponse<ProductModel>> => {
  return await apiGet<ProductModel>(`${PRODUCTS_ENDPOINT}/${productId}`);
};

/**
 * Create a new product
 * @param productData Product data to create
 * @returns Promise with created product data
 */
export const createProduct = async (
  productData: CreateProductRequest
): Promise<ApiResponse<ProductModel>> => {
  return await apiPost<CreateProductRequest, ProductModel>(
    PRODUCTS_ENDPOINT,
    productData
  );
};

/**
 * Update an existing product
 * @param productId Product ID to update
 * @param updateData Updated product data
 * @returns Promise with updated product data
 */
export const updateProduct = async (
  productId: string,
  updateData: UpdateProductRequest
): Promise<ApiResponse<ProductModel>> => {
  return await apiPut<UpdateProductRequest, ProductModel>(
    `${PRODUCTS_ENDPOINT}/${productId}`,
    updateData
  );
};

/**
 * Delete a product
 * @param productId Product ID to delete
 * @returns Promise with deletion result
 */
export const deleteProduct = async (
  productId: string
): Promise<ApiResponse<void>> => {
  return await apiDelete<void>(`${PRODUCTS_ENDPOINT}/${productId}`);
};

/**
 * Get all product types
 * @returns Promise with product types list
 */
export const getAllProductTypes = async (): Promise<
  ApiResponse<ProductType[]>
> => {
  return await apiGet<ProductType[]>(PRODUCT_TYPES_ENDPOINT);
};

/**
 * Delete multiple products
 * @param productIds Array of product IDs to delete
 * @returns Promise with deletion result
 */
export const bulkDeleteProducts = async (
  productIds: string[]
): Promise<ApiResponse<void>> => {
  return await apiDelete<void>(`${PRODUCTS_ENDPOINT}/bulk`, {
    data: { productIds },
  });
};

// Removed duplicate functionality as requested by user

/**
 * Delete an image from Cloudinary
 * @param imageUrl URL of the image to delete
 * @returns Promise with deletion result
 */
export const deleteImageFromCloudinary = async (
  imageUrl: string
): Promise<ApiResponse<void>> => {
  return await apiDelete<void>(`/images/cloudinary`, {
    data: { imageUrl },
  });
};

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  getAllProductTypes,
  getProductStatistics,
  deleteImageFromCloudinary,
};
