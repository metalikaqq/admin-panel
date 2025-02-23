'use client';

import React, { useState, useEffect } from 'react';
import s from './ProductImage.module.scss';

// Helper function to convert image file to base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

interface ProductImageProps {
  onUpdate?: (images: string[]) => void; // Optional, for passing images
  images?: string[]; // Optional, for displaying images
}

const ProductImage: React.FC<ProductImageProps> = ({
  onUpdate,
  images = [],
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>(images);
  const [imageCount, setImageCount] = useState(8);

  // Handle file input and update images as base64
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64Image = await toBase64(file);
      setSelectedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = base64Image; // Store base64 string
        return newImages;
      });
    }
  };

  // Add more image inputs
  const addMoreImages = () => {
    setImageCount((prevCount) => prevCount + 4);
  };

  // Update parent with the selected images
  useEffect(() => {
    if (onUpdate) {
      onUpdate(selectedImages);
    }
  }, [selectedImages, onUpdate]);

  return (
    <div className={s.product__image}>
      <h3 className={s.product__image__title}>Upload Images</h3>
      <div className={s.product__image__wrapper}>
        <div className={s.product__image__top}>
          <label className={s.product__image__label}>
            {selectedImages[0] ? (
              <img
                src={selectedImages[0]}
                alt="Main product"
                className={s.product__image__preview}
              />
            ) : (
              <span className={s.product__image__placeholder}>
                Upload Main Image
              </span>
            )}
            <input
              className={s.product__image__input}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 0)}
            />
          </label>
        </div>

        <div className={s.product__image__bottom}>
          {[...Array(imageCount)].map((_, index) => (
            <label key={index + 1} className={s.product__image__label}>
              {selectedImages[index + 1] ? (
                <img
                  src={selectedImages[index + 1]}
                  alt={`Product ${index + 1}`}
                  className={s.product__image__preview}
                />
              ) : (
                <span className={s.product__image__placeholder}>
                  Upload Image
                </span>
              )}
              <input
                className={s.product__image__input}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index + 1)}
              />
            </label>
          ))}
        </div>

        <button
          className={s.product__image__addMoreButton}
          onClick={addMoreImages}
        >
          Add More Images
        </button>
      </div>
    </div>
  );
};

export default ProductImage;
