'use client';

import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productManagementService';

export default function TestProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('🧪 [TestProductsPage] Starting product fetch...');
      setLoading(true);

      try {
        const response = await productService.getAllProducts({ page: 1, limit: 10 });
        console.log('🧪 [TestProductsPage] Raw API response:', response);

        if (response.success && response.data) {
          console.log('🧪 [TestProductsPage] Response data structure:', {
            dataIsArray: Array.isArray(response.data),
            dataKeys: Object.keys(response.data),
            hasDataProperty: !!response.data.data,
            dataDataIsArray: Array.isArray(response.data.data),
            productsCount: response.data.data?.length || 0
          });

          if (response.data.data && Array.isArray(response.data.data)) {
            setProducts(response.data.data);
            console.log('🧪 [TestProductsPage] Products set successfully:', response.data.data.length);
          } else {
            console.log('🧪 [TestProductsPage] No data.data array found');
            setError('No products data found in response');
          }
        } else {
          console.log('🧪 [TestProductsPage] API call failed or no data');
          setError('API call failed');
        }
      } catch (err) {
        console.error('🧪 [TestProductsPage] Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Products Page</h1>
      <p>Found {products.length} products</p>

      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={product.id || index}>
              <strong>{product.name}</strong> - Type: {product.productType?.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}
