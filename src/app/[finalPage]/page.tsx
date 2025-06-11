'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductImages from './components/ProductImages/ProductImages';
import ProductScroll from './components/ProductScroll/ProductScroll';
import { useProductStore } from '@/store/useProductStore';
import { uploadMultipleImages } from '@/services/cloudinaryService';
import {
  createProduct,
  validateProductData,
  createProductPayload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ProductPayload,
} from '@/services/productService';
import s from './page.module.scss';

// Local interfaces that are still needed for this component
interface LocalizedContent {
  uk: string;
  en: string;
}

const FinalPage: React.FC = () => {
  const {
    productInfo,
    productImages,
    loadFromSessionStorage,
    activeLanguage,
    selectedProductTypeId,
  } = useProductStore();
  const [generatedHtml, setGeneratedHtml] = useState<LocalizedContent>({
    uk: '',
    en: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';
  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';

  /**
   * Load product data from session storage when component mounts
   */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loaded = loadFromSessionStorage();
    setIsLoading(false);
    console.log('[FinalPage] Loaded Product Info:', productInfo);
    console.log('[FinalPage] Selected Product Type ID:', selectedProductTypeId);

    // Log more details about the product type selection
    if (selectedProductTypeId) {
      // Fetch product type details for better logging
      const fetchProductTypeDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/product-types/${selectedProductTypeId}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log(
              '[FinalPage] Complete Product Type Details:',
              data.data
            );
          }
        } catch (error) {
          console.error(
            '[FinalPage] Error fetching product type details:',
            error
          );
        }
      };

      fetchProductTypeDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFromSessionStorage]);

  /**
   * Handle HTML generated from ProductScroll component
   */
  const handleHtmlGenerated = useCallback(
    (html: { uk: string; en: string }) => {
      setGeneratedHtml(html);
      console.log('[FinalPage] HTML content generated');
    },
    []
  );

  /**
   * Display a notification toast
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => {
    const options = {
      position: 'top-right' as ToastPosition,
      autoClose: 5000,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
    }
  };

  /**
   * Handle product creation
   * This function validates the product data, uploads images to Cloudinary,
   * and sends the product data to the backend API
   */
  const handleCreateProduct = async () => {
    // Validate product data using service function
    const validationResult = validateProductData(
      productInfo,
      productImages,
      selectedProductTypeId
    );
    if (!validationResult.valid) {
      toast.error(validationResult.message);
      return;
    }

    // Get valid images (filter out empty strings)
    const validImages = productImages.filter((img) => img);

    setIsSubmitting(true);
    console.log('[FinalPage] Starting product creation process');
    console.log('[FinalPage] Selected product type ID:', selectedProductTypeId);

    try {
      // Upload images to Cloudinary using service function
      const successfulUploads = await uploadMultipleImages(
        validImages,
        CLOUDINARY_UPLOAD_PRESET,
        CLOUDINARY_CLOUD_NAME
      );

      // Create product payload using service function
      // This will throw an error if the product type is null, but our validation ensures it's not
      const payload = createProductPayload(
        productInfo,
        selectedProductTypeId as string,
        successfulUploads,
        generatedHtml
      );

      // Detailed product information logs
      console.log(
        '[FinalPage] Creating product with productType ID:',
        payload.productTypeId
      );

      // Log detailed product information
      console.log('[FinalPage] Complete Product Details:', {
        productTypeId: payload.productTypeId,
        productNames: {
          uk: payload.productNames.uk,
          en: payload.productNames.en,
        },
        // Don't log full image URLs for security/brevity
        imagesCount: payload.images.length,
        imageUrls: payload.images.map(
          (img) => img.imageUrl.substring(0, 50) + '...'
        ),
        htmlContent: {
          uk: payload.htmlContent.uk.substring(0, 100) + '...',
          en: payload.htmlContent.en.substring(0, 100) + '...',
        },
      });

      // Product info structure debugging
      console.log(
        '[FinalPage] Product Info Structure:',
        productInfo.map((info) => ({
          id: info.id,
          type: info.type,
          label: info.label,
          valueLength: {
            uk: info.value.uk.length,
            en: info.value.en.length,
          },
          itemsCount: info.items?.length || 0,
        }))
      );

      // Create product using service function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await createProduct<any>(payload);

      // Log detailed summary of created product
      console.log('[FinalPage] Product created successfully:', result);

      // Log complete product creation summary with all info
      console.log('[FinalPage] COMPLETE PRODUCT CREATION SUMMARY', {
        timestamp: new Date().toISOString(),
        productType: {
          id: selectedProductTypeId,
          // We would normally fetch the product type name here, but for brevity we're omitting that
        },
        productNames: payload.productNames,
        productImages: {
          count: payload.images.length,
          urls: payload.images.map(
            (img) => img.imageUrl.substring(0, 30) + '...'
          ),
        },
        htmlContentSizes: {
          uk: payload.htmlContent.uk.length,
          en: payload.htmlContent.en.length,
        },
        responseFromServer: result,
      });

      toast.success('Product created successfully!');
      setCreationSuccess(true);

      // Optional: Redirect to products list or clear the form
      // window.location.href = '/products';
    } catch (error) {
      console.error('[FinalPage] Error in product creation:', error);
      
      // Extract more detailed error information
      let errorMessage = 'Please try again';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error('[FinalPage] Detailed error information:', {
        error: error,
        timestamp: new Date().toISOString()
      });
      
      toast.error(`Failed to create product: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Display loading state while retrieving data
   */
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Filter out empty images
  const validImages = productImages.filter((img) => img !== '');

  return (
    <div className={s.product}>
      {/* Toast container for notifications */}
      <ToastContainer position="top-right" />

      {/* Product images section */}
      <ProductImages productImages={validImages} />

      {/* Product info section */}
      <div className={s.product__info}>
        <ProductScroll
          productInfo={productInfo}
          activeLanguage={activeLanguage}
          onHtmlGenerated={handleHtmlGenerated}
        />

        {/* Success message for product creation */}
        {creationSuccess && (
          <div className={s.successMessage}>
            Product was successfully created!
          </div>
        )}

        {/* Create product button */}
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
