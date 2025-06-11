// Image interface for product images (full model from database)
export interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

// Image interface for creating/updating products (only required fields)
export interface ProductImageInput {
  imageUrl: string;
  isMain: boolean;
}

// Product model representing a product in the system (matches backend response)
export interface ProductModel {
  id: string;
  name: string;
  productNames: ProductNames;
  htmlContent: LocalizedContent;
  images: ProductImage[];
  productTypeId: string;
  productType: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// Localized content interface (for content that has both Ukrainian and English versions)
export interface LocalizedContent {
  uk: string;
  en: string;
}

// Product names in different languages
export interface ProductNames {
  uk: string[];
  en: string[];
}

// Product type interface
export interface ProductType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Create product request interface
export interface CreateProductRequest {
  productTypeId: string;
  productNames: ProductNames;
  images: ProductImageInput[]; // Changed to ProductImageInput
  htmlContent: LocalizedContent;
}

// Update product request interface
export interface UpdateProductRequest {
  productTypeId?: string;
  productNames?: ProductNames;
  images?: ProductImageInput[]; // Changed to ProductImageInput
  htmlContent?: LocalizedContent;
}

// Response format for paginated product list
export interface ProductListResponse {
  data: ProductModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
