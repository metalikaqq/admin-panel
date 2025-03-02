'use client';

import React, { useState } from 'react';
import s from './ProductImage.module.scss';
import { useProductStore } from '@/store/useProductStore';

// Helper function to convert image file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface ProductImageProps {
  onUpdate?: (images: string[]) => void; // Optional, for passing images
}

const ProductImage: React.FC<ProductImageProps> = ({ onUpdate }) => {
  const { productImages, updateImageAtIndex, addMoreImageSlots } = useProductStore();
  const [imageCount, setImageCount] = useState(8); // Initial count of additional images

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Image = await fileToBase64(file);

        // Оновлюємо зображення в нашому store
        updateImageAtIndex(index, base64Image);

        // Якщо onUpdate проп наданий, викликаємо його з оновленими зображеннями
        if (onUpdate) {
          // Отримуємо найновіші дані зі store безпосередньо, без setTimeout
          const updatedImages = useProductStore.getState().productImages;
          onUpdate(updatedImages);
        }
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }
  };

  const addMoreImages = () => {
    setImageCount(prevCount => prevCount + 4);
    addMoreImageSlots(4);
  };

  // Підрахуємо кількість завантажених зображень для відображення користувачу
  const uploadedCount = productImages.filter(Boolean).length;

  return (
    <div className={s.product__image}>
      <h3 className={s.product__image__title}>
        Upload Images
        <span className={s.product__image__count}>
          ({uploadedCount} uploaded)
        </span>
      </h3>
      <div className={s.product__image__wrapper}>
        <div className={s.product__image__top}>
          <label className={s.product__image__label}>
            {productImages[0] ? (
              <img
                src={productImages[0]}
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
              {productImages[index + 1] ? (
                <img
                  src={productImages[index + 1]}
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