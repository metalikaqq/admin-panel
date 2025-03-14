'use client';
import React, { useEffect, useState, useCallback } from 'react';
import ProductImages from './components/ProductImages/ProductImages';
import ProductScroll from './components/ProductScroll/ProductScroll';
import { useProductStore } from '@/store/useProductStore';
import s from './page.module.scss';

const FinalPage: React.FC = () => {
  const { productInfo, productImages, loadFromSessionStorage, activeLanguage } =
    useProductStore();
  const [generatedHtml, setGeneratedHtml] = useState<{
    uk: string;
    en: string;
  }>({ uk: '', en: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary конфігурація
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';
  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
  const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loaded = loadFromSessionStorage();
    setIsLoading(false);
    console.log('Loaded Product Info:', productInfo);
    console.log('Active Language:', activeLanguage);
  }, [loadFromSessionStorage]);

  // Використовуємо useCallback для стабілізації функції між рендерами
  const handleHtmlGenerated = useCallback(
    (html: { uk: string; en: string }) => {
      setGeneratedHtml(html);
    },
    []
  );

  const uploadImageToCloudinary = async (
    imageData: string
  ): Promise<string> => {
    if (!imageData) {
      console.log('Skipping empty image');
      return '';
    }

    try {
      if (!imageData.startsWith('data:')) {
        console.error(
          'Invalid image format, not a data URL:',
          imageData.substring(0, 30) + '...'
        );
        return '';
      }

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

      console.log(
        'Uploading to Cloudinary with preset:',
        CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(CLOUDINARY_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cloudinary error response:', errorData);
        throw new Error(
          `Cloudinary responded with status ${response.status}: ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      console.log('Successfully uploaded image to Cloudinary');
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return '';
    }
  };

  const handleCreateProduct = async () => {
    if (!productInfo || !productImages) {
      alert('Please add product information and images');
      return;
    }

    const validImages = productImages.filter((img) => img);

    if (validImages.length === 0) {
      alert('Please add at least one product image');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        `Attempting to upload ${validImages.length} images to Cloudinary`
      );

      const cloudinaryUrls = await Promise.all(
        validImages.map((img) => uploadImageToCloudinary(img))
      );
      const successfulUploads = cloudinaryUrls.filter((url) => url);

      console.log(
        `Successfully uploaded ${successfulUploads.length} of ${validImages.length} images`
      );

      if (successfulUploads.length === 0) {
        throw new Error(
          'Failed to upload any images. Please check your Cloudinary configuration.'
        );
      }

      const productNamesUk = productInfo
        .filter((input) => input.type === 'productName' && input.value.uk)
        .map((input) => input.value.uk);

      const productNamesEn = productInfo
        .filter((input) => input.type === 'productName' && input.value.en)
        .map((input) => input.value.en);

      if (productNamesUk.length === 0 && productNamesEn.length === 0) {
        throw new Error(
          'Please add at least one product name in either Ukrainian or English'
        );
      }

      // Create payload with successful uploads and both languages
      const payload = {
        productNames: {
          uk: productNamesUk,
          en: productNamesEn,
        },
        productImages: successfulUploads,
        htmlContent: {
          uk: generatedHtml.uk,
          en: generatedHtml.en,
        },
      };

      console.log('Creating product with payload:', payload);

      const response = await fetch('http://localhost:3000/products', {
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
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Unknown error' }));
        console.error('Failed to create product', errorData);
        alert(
          `Failed to create product: ${errorData.message || 'Please try again'}`
        );
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert(
        `An error occurred: ${error instanceof Error ? error.message : 'Please try again'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const validImages = productImages.filter((img) => img !== '');

  return (
    <div className={s.product}>
      <ProductImages productImages={validImages} />
      <div className={s.product__info}>
        <ProductScroll
          productInfo={productInfo}
          activeLanguage={activeLanguage}
          onHtmlGenerated={handleHtmlGenerated}
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
