import { productService } from './productManagementService';
import * as apiService from './apiService';

// Mock the API service
jest.mock('./apiService', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));

describe('Product Management Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('calls apiGet with correct parameters', async () => {
      (apiService.apiGet as jest.Mock).mockResolvedValue({
        success: true,
        data: [{ id: '1', name: 'Test Product' }],
      });

      await productService.getAllProducts(2, 20);

      expect(apiService.apiGet).toHaveBeenCalledWith(
        '/products?page=2&limit=20'
      );
    });

    it('uses default pagination when not provided', async () => {
      (apiService.apiGet as jest.Mock).mockResolvedValue({
        success: true,
        data: [{ id: '1', name: 'Test Product' }],
      });

      await productService.getAllProducts();

      expect(apiService.apiGet).toHaveBeenCalledWith(
        '/products?page=1&limit=10'
      );
    });
  });

  describe('getProductById', () => {
    it('calls apiGet with correct product ID', async () => {
      (apiService.apiGet as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: '123', name: 'Test Product' },
      });

      await productService.getProductById('123');

      expect(apiService.apiGet).toHaveBeenCalledWith('/products/123');
    });
  });

  describe('createProduct', () => {
    it('calls apiPost with correct data', async () => {
      const productData = {
        productTypeId: '1',
        productNames: { en: ['Test Product'], uk: [] },
        productImages: ['image-url'],
        htmlContent: { en: 'Test content', uk: '' },
      };

      (apiService.apiPost as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: '123', ...productData },
      });

      await productService.createProduct(productData);

      expect(apiService.apiPost).toHaveBeenCalledWith('/products', productData);
    });
  });

  describe('updateProduct', () => {
    it('calls apiPut with correct data', async () => {
      const updateData = {
        productTypeId: '1',
        productNames: { en: ['Updated Product'], uk: [] },
      };

      (apiService.apiPut as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: '123', ...updateData },
      });

      await productService.updateProduct('123', updateData);

      expect(apiService.apiPut).toHaveBeenCalledWith(
        '/products/123',
        updateData
      );
    });
  });

  describe('deleteProduct', () => {
    it('calls apiDelete with correct product ID', async () => {
      (apiService.apiDelete as jest.Mock).mockResolvedValue({
        success: true,
      });

      await productService.deleteProduct('123');

      expect(apiService.apiDelete).toHaveBeenCalledWith('/products/123');
    });
  });

  describe('getAllProductTypes', () => {
    it('calls apiGet with correct endpoint', async () => {
      (apiService.apiGet as jest.Mock).mockResolvedValue({
        success: true,
        data: [{ id: '1', name: 'Type 1' }],
      });

      await productService.getAllProductTypes();

      expect(apiService.apiGet).toHaveBeenCalledWith('/product-types');
    });
  });
});
