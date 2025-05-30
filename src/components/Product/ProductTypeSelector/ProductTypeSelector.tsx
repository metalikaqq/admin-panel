'use client';

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useProductStore } from '@/store/useProductStore';

// Define API base URL
const API_BASE_URL = 'http://localhost:3000';

// Define ProductType interface
interface ProductType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API Response interface
interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface ProductTypeSelectorProps {
  onChange?: (productTypeId: string) => void;
}

const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({
  onChange,
}) => {
  const { selectedProductTypeId, setSelectedProductTypeId } = useProductStore();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse<ProductType[]>>(
        `${API_BASE_URL}/product-types`
      );

      // Ensure we always have an array
      const data = response.data?.data;
      if (Array.isArray(data)) {
        setProductTypes(data);

        // If no product type selected yet but we have product types, select the first one
        if (!selectedProductTypeId && data.length > 0) {
          handleChange(data[0].id);
        }
      } else {
        console.error('API response data is not an array:', data);
        setProductTypes([]);
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
      setProductTypes([]); // Ensure productTypes is always an array
      setError('Failed to load product types');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (productTypeId: string) => {
    setSelectedProductTypeId(productTypeId);

    // Get the selected product type details for better logging
    const selectedType = Array.isArray(productTypes)
      ? productTypes.find((type) => type.id === productTypeId)
      : undefined;

    console.log('[ProductTypeSelector] Product type selected:', {
      id: productTypeId,
      name: selectedType?.name,
      createdAt: selectedType?.createdAt,
      updatedAt: selectedType?.updatedAt,
    });

    // Log store update
    console.log(
      '[ProductTypeSelector] Updated product type in store:',
      productTypeId
    );

    if (onChange) {
      onChange(productTypeId);
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 3 }} error={!!error}>
      <InputLabel id="product-type-selector-label">Product Type</InputLabel>
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <span>Loading product types...</span>
        </Box>
      ) : (
        <Select
          labelId="product-type-selector-label"
          id="product-type-selector"
          value={selectedProductTypeId || ''}
          label="Product Type"
          onChange={(e) => handleChange(e.target.value as string)}
        >
          {!Array.isArray(productTypes) || productTypes.length === 0 ? (
            <MenuItem disabled value="">
              No product types available
            </MenuItem>
          ) : (
            productTypes.map((productType) => (
              <MenuItem key={productType.id} value={productType.id}>
                {productType.name}
              </MenuItem>
            ))
          )}
        </Select>
      )}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

export default ProductTypeSelector;
