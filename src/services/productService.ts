/**
 * Product Service for handling product-related API calls
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toast } from 'react-toastify';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axiosClient from '@/api/axiosClient';

// Type definitions
export interface LocalizedContent {
  uk: string;
  en: string;
}

export interface ProductNames {
  uk: string[];
  en: string[];
}

export interface ProductImage {
  imageUrl: string;
  isMain: boolean;
}

export interface ProductPayload {
  productTypeId: string;
  productNames: ProductNames;
  images: ProductImage[]; // Змінено з productImages на images
  htmlContent: LocalizedContent;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

import { apiPost } from './apiService';

/**
 * Creates a product with the provided data
 * @param productData The product data to create
 * @returns The created product data
 */
export const createProduct = async <T>(
  productData: ProductPayload
): Promise<ApiResponse<T>> => {
  console.log('[ProductService] Creating product with payload:', productData);

  try {
    // Use the apiService to make the POST request
    const responseData = await apiPost<ProductPayload, T>(
      '/products',
      productData
    );
    console.log('[ProductService] Product creation response:', responseData);
    
    // Check if the request was actually successful
    if (!responseData.success) {
      throw new Error(responseData.error || 'Failed to create product');
    }
    
    console.log('[ProductService] Product created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('[ProductService] Error creating product:', error);
    throw error;
  }
};

/**
 * Validates and creates the product payload
 * @param productInfo Product information fields
 * @param selectedProductTypeId Selected product type ID
 * @param productImages Product images
 * @param generatedHtml Generated HTML content
 * @returns The validated product payload
 */
export const createProductPayload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productInfo: any[],
  selectedProductTypeId: string | null,
  productImages: string[],
  generatedHtml: { uk: string; en: string }
): ProductPayload => {
  console.log(
    '[ProductService] Creating product payload with type ID:',
    selectedProductTypeId
  );

  // Log time for debugging timing issues
  console.log(
    '[ProductService] Payload creation timestamp:',
    new Date().toISOString()
  );

  // Log product info summary
  console.log('[ProductService] Product info summary:', {
    totalFields: productInfo.length,
    fieldTypes: productInfo.map((item) => item.type),
    imagesCount: productImages.length,
    htmlContentSizes: {
      uk: generatedHtml.uk.length,
      en: generatedHtml.en.length,
    },
  });

  // Validate product type
  if (!selectedProductTypeId) {
    console.error('[ProductService] Missing product type ID');
    throw new Error('Please select a product type');
  }

  // Extract product names with improved filtering for trimmed values
  const productNamesUk = productInfo
    .filter((input) => input.type === 'productName' && input.value.uk.trim())
    .map((input) => input.value.uk.trim());

  const productNamesEn = productInfo
    .filter((input) => input.type === 'productName' && input.value.en.trim())
    .map((input) => input.value.en.trim());

  console.log('[ProductService] Extracted product names:', {
    uk: productNamesUk,
    en: productNamesEn,
  });

  // Final validation for product names
  if (productNamesUk.length === 0 && productNamesEn.length === 0) {
    throw new Error(
      'Please add at least one product name in either Ukrainian or English'
    );
  }

  // Create images array with proper structure for backend
  const images: ProductImage[] = productImages.map((imageUrl, index) => ({
    imageUrl: imageUrl,
    isMain: index === 0, // First image is main
  }));

  // Structure payload with all required fields
  return {
    productTypeId: selectedProductTypeId,
    productNames: {
      uk: productNamesUk,
      en: productNamesEn,
    },
    images: images, // Змінено з productImages на images
    htmlContent: {
      uk: generatedHtml.uk,
      en: generatedHtml.en,
    },
  };
};

/**
 * Validates the product data before submission
 * @param productInfo Product information fields
 * @param productImages Product images
 * @param selectedProductTypeId Selected product type ID
 * @returns Validation result with success status and message
 */
export const validateProductData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productInfo: any[],
  productImages: string[],
  selectedProductTypeId: string | null
) => {
  console.log('[ProductService] Validating product data');

  // Check for product info and images
  if (!productInfo || !productImages) {
    return {
      valid: false,
      message: 'Please add product information and images',
    };
  }

  // Check for product type
  if (!selectedProductTypeId) {
    return { valid: false, message: 'Please select a product type' };
  }

  // Check for images
  const validImages = productImages.filter((img) => img);
  if (validImages.length === 0) {
    return { valid: false, message: 'Please add at least one product image' };
  }

  // Check for product names
  const hasProductName = productInfo.some(
    (input) =>
      input.type === 'productName' &&
      (input.value.uk.trim() || input.value.en.trim())
  );

  if (!hasProductName) {
    return { valid: false, message: 'Please add at least one product name' };
  }

  return { valid: true, message: 'Validation successful' };
};
