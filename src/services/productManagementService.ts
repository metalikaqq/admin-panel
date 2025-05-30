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

/**
 * Get all products with pagination
 * @param page Page number (default: 1)
 * @param limit Items per page (default: 10)
 * @returns Promise with products list and pagination metadata
 */
export const getAllProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<ProductModel[]>> => {
  return await apiGet<ProductModel[]>(
    `${PRODUCTS_ENDPOINT}?page=${page}&limit=${limit}`
  );
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

export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductTypes,
};
