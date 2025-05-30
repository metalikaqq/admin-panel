// Product model representing a product in the system
export interface ProductModel {
  id: string;
  productTypeId: string;
  productNames: ProductNames;
  productImages: string[];
  htmlContent: LocalizedContent;
  createdAt: string;
  updatedAt: string;
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
  productImages: string[];
  htmlContent: LocalizedContent;
}

// Update product request interface
export interface UpdateProductRequest {
  productTypeId?: string;
  productNames?: ProductNames;
  productImages?: string[];
  htmlContent?: LocalizedContent;
}

// Response format for paginated product list
export interface ProductListResponse {
  products: ProductModel[];
  metadata: {
    total: number;
    page: number;
    limit: number;
  };
}
