/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import ProductImages from './components/ProductImages/ProductImages';
import ProductScroll from './components/ProductScroll/ProductScroll';
import { useProductStore } from '@/store/useProductStore';
import s from './page.module.scss';

const FinalPage: React.FC = () => {
  const { productInfo, productImages, loadFromSessionStorage } = useProductStore();
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary конфігурація - помістіть ці значення в .env
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  useEffect(() => {
    // Завантаження даних із sessionStorage при першій загрузці сторінки
    const loaded = loadFromSessionStorage();
    setIsLoading(false);
  }, [loadFromSessionStorage]);

  const uploadImageToCloudinary = async (imageData: string): Promise<string> => {
    // Skip empty images
    if (!imageData) {
      console.log('Skipping empty image');
      return '';
    }

    try {
      // Check if the image is a valid data URL
      if (!imageData.startsWith('data:')) {
        console.error('Invalid image format, not a data URL:', imageData.substring(0, 30) + '...');
        return '';
      }

      // Extract base64 data properly
      const parts = imageData.split(';base64,');
      if (parts.length !== 2) {
        console.error('Invalid base64 image format');
        return '';
      }

      const base64Data = parts[1];
      const mimeType = parts[0].replace('data:', '');

      const formData = new FormData();
      formData.append('file', `data:${mimeType};base64,${base64Data}`);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      console.log('Uploading to Cloudinary with preset:', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cloudinary error response:', errorData);
        throw new Error(`Cloudinary responded with status ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Successfully uploaded image to Cloudinary');
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      // Instead of throwing, return empty string to prevent Promise.all from failing completely
      return '';
    }
  };

  const handleCreateProduct = async () => {
    if (!productInfo || !productImages) {
      alert('Please add product information and images');
      return;
    }

    // Get only valid (non-empty) images
    const validImages = productImages.filter(img => img);

    if (validImages.length === 0) {
      alert('Please add at least one product image');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`Attempting to upload ${validImages.length} images to Cloudinary`);

      // Upload images and filter out failed uploads (empty strings)
      const cloudinaryUrls = await Promise.all(
        validImages.map(img => uploadImageToCloudinary(img))
      );
      const successfulUploads = cloudinaryUrls.filter(url => url);

      console.log(`Successfully uploaded ${successfulUploads.length} of ${validImages.length} images`);

      if (successfulUploads.length === 0) {
        throw new Error('Failed to upload any images. Please check your Cloudinary configuration.');
      }

      // Get product names
      const productNames = productInfo
        .filter((input) => input.type === 'productName' && input.value)
        .map((input) => input.value);

      if (productNames.length === 0) {
        throw new Error('Please add at least one product name');
      }

      // Create payload with successful uploads
      const payload = {
        productNames,
        productImages: successfulUploads,
        htmlContent: generatedHtml,
      };

      console.log('Creating product with payload:', payload);

      // Send data to backend
      const response = await fetch('http://localhost:3000/api/products', {  // Changed to relative URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product created successfully:', result);
        alert('Product created successfully!');
        // Optionally redirect to product list or clear form
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Failed to create product', errorData);
        alert(`Failed to create product: ${errorData.message || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Фільтруємо тільки непусті зображення перед передачею їх у компонент
  const validImages = productImages.filter(img => img !== '');

  return (
    <div className={s.product}>
      {/* Передаємо тільки валідні зображення */}
      <ProductImages productImages={validImages} />
      <div className={s.product__info}>
        <ProductScroll
          productInfo={productInfo}
          onHtmlGenerated={(html: string) => setGeneratedHtml(html)}
        />
        <button
          className={s.createButton}
          onClick={handleCreateProduct}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </div>
  );
};

export default FinalPage;