import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductFormModal from './ProductFormModal';
import { productService } from '@/services/productManagementService';
import * as cloudinaryService from '@/services/cloudinaryService';

// Mock the necessary modules
jest.mock('@/services/productManagementService', () => ({
  productService: {
    getAllProductTypes: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
  }
}));

jest.mock('@/services/cloudinaryService', () => ({
  uploadImageToCloudinary: jest.fn(),
  uploadMultipleImages: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('ProductFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    product: null,
    isEditMode: false,
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful product types fetch
    (productService.getAllProductTypes as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        { id: '1', name: 'Type 1' },
        { id: '2', name: 'Type 2' },
      ],
    });
  });

  test('renders the form in create mode', async () => {
    render(<ProductFormModal {...defaultProps} />);

    // Wait for product types to load
    await waitFor(() => {
      expect(productService.getAllProductTypes).toHaveBeenCalled();
    });

    // Check if main components are rendered
    expect(screen.getByText('Create New Product')).toBeInTheDocument();
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<ProductFormModal {...defaultProps} />);

    // Wait for product types to load
    await waitFor(() => {
      expect(productService.getAllProductTypes).toHaveBeenCalled();
    });

    // Submit form without filling data
    const createButton = screen.getByText('Create Product');
    fireEvent.click(createButton);

    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/Product name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a product type/i)).toBeInTheDocument();
    });
  });

  test('handles image upload', async () => {
    // Mock successful image upload
    (cloudinaryService.uploadImageToCloudinary as jest.Mock).mockResolvedValue('https://example.com/test-image.jpg');

    render(<ProductFormModal {...defaultProps} />);

    // Navigate to Images tab
    const imagesTab = screen.getByText('Images');
    fireEvent.click(imagesTab);

    // Mock file upload
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });
      fireEvent.change(fileInput);
    }

    // Click upload button
    const uploadButton = screen.getByText('Upload');
    fireEvent.click(uploadButton);

    // Check if Cloudinary service was called
    await waitFor(() => {
      expect(cloudinaryService.uploadImageToCloudinary).toHaveBeenCalled();
    });
  });
});
