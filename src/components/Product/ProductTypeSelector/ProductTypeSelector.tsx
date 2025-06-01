'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
} from '@mui/material';
import { useProductStore } from '@/store/useProductStore';
import { apiGet } from '@/services/apiService';

// Define ProductType interface
interface ProductType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
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

  const handleChange = useCallback(
    (productTypeId: string) => {
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
    },
    [productTypes, setSelectedProductTypeId, onChange]
  );

  const fetchProductTypes = useCallback(async () => {
    console.log('[ProductTypeSelector] Starting fetchProductTypes...');
    setLoading(true);
    setError(null);
    try {
      console.log(
        '[ProductTypeSelector] Making request to product-types endpoint'
      );

      const response = await apiGet<ProductType[]>('/product-types');

      console.log('[ProductTypeSelector] Raw response:', response);
      console.log('[ProductTypeSelector] Response success:', response.success);
      console.log('[ProductTypeSelector] Response data:', response.data);

      if (response.success && Array.isArray(response.data)) {
        console.log(
          '[ProductTypeSelector] Data is array, length:',
          response.data.length
        );
        setProductTypes(response.data);

        // If no product type selected yet but we have product types, select the first one
        if (!selectedProductTypeId && response.data.length > 0) {
          console.log(
            '[ProductTypeSelector] Auto-selecting first product type:',
            response.data[0]
          );
          handleChange(response.data[0].id);
        }
      } else {
        console.error(
          '[ProductTypeSelector] API response failed or data is not an array:',
          response
        );
        setProductTypes([]);
        setError(response.error || 'Invalid response format from server');
      }
    } catch (error) {
      console.error(
        '[ProductTypeSelector] Error fetching product types:',
        error
      );
      setProductTypes([]); // Ensure productTypes is always an array
      setError('Failed to load product types');
    } finally {
      setLoading(false);
      console.log('[ProductTypeSelector] fetchProductTypes completed');
    }
  }, [selectedProductTypeId, handleChange]);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

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
