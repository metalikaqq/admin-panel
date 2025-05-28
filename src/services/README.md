# API Services Documentation

This directory contains service modules for handling API interactions and data processing in the admin panel application.

## Available Services

### apiService.ts

Core service for handling API requests to the backend with proper logging and error handling.

- `apiGet<T>(endpoint)`: For making GET requests
- `apiPost<T, R>(endpoint, data)`: For making POST requests
- `apiPut<T, R>(endpoint, data)`: For making PUT requests
- `apiDelete<T>(endpoint)`: For making DELETE requests

### cloudinaryService.ts

Service for handling image uploads to Cloudinary.

- `uploadImageToCloudinary(imageData, uploadPreset, cloudName)`: Uploads a single image
- `uploadMultipleImages(images, uploadPreset, cloudName)`: Uploads multiple images in parallel

### productService.ts

Service for product-related operations and data handling.

- `createProduct<T>(productData)`: Creates a product with the provided data
- `validateProductData(productInfo, productImages, selectedProductTypeId)`: Validates product data before submission
- `createProductPayload(productInfo, selectedProductTypeId, productImages, generatedHtml)`: Creates a properly structured payload

## Usage Examples

### Creating a Product

```typescript
import {
  createProduct,
  validateProductData,
  createProductPayload,
} from '@/services/productService';
import { uploadMultipleImages } from '@/services/cloudinaryService';

// 1. Validate the product data
const validationResult = validateProductData(
  productInfo,
  productImages,
  selectedProductTypeId
);
if (!validationResult.valid) {
  // Handle validation error
  console.error(validationResult.message);
  return;
}

// 2. Upload images
const successfulUploads = await uploadMultipleImages(
  validImages,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_CLOUD_NAME
);

// 3. Create the product payload
const payload = createProductPayload(
  productInfo,
  selectedProductTypeId,
  successfulUploads,
  generatedHtml
);

// 4. Send the product data to the backend
const result = await createProduct<ProductResponse>(payload);
```

### Making Custom API Calls

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/apiService';

// GET request
const productTypes = await apiGet<ProductType[]>('/product-types');

// POST request
const newProduct = await apiPost<CreateProductRequest, ProductResponse>(
  '/products',
  productData
);

// PUT request
const updatedProduct = await apiPut<UpdateProductRequest, ProductResponse>(
  `/products/${productId}`,
  updateData
);

// DELETE request
await apiDelete<void>(`/products/${productId}`);
```
