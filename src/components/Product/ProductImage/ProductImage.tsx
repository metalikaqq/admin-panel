"use client";

import React, { useState } from "react";
import s from "./ProductImage.module.scss";

function ProductImage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageCount, setImageCount] = useState(8); // Initial count set to 8

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = imageUrl;
        return newImages;
      });
    }
  };

  const addMoreImages = () => {
    setImageCount((prevCount) => prevCount + 4); // Increase by 4 more images when clicking "Add More"
  };

  return (
    <div className={s.product__image}>
      <h3 className={s.product__image__title}>Upload Image</h3>

      <div className={s.product__image__wrapper}>
        <div className={s.product__image__top}>
          <label className={s.product__image__label}>
            {selectedImages[0] ? (
              <img src={selectedImages[0]} alt="Main product" className={s.product__image__preview} />
            ) : (
              <span className={s.product__image__placeholder}>Upload Main Image</span>
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
            <label key={index} className={s.product__image__label}>
              {selectedImages[index + 1] ? (
                <img
                  src={selectedImages[index + 1]}
                  alt={`Product ${index + 1}`}
                  className={s.product__image__preview}
                />
              ) : (
                <span className={s.product__image__placeholder}>Upload Image</span>
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

        <button className={s.product__image__addMoreButton} onClick={addMoreImages}>
          Add More Images
        </button>
      </div>
    </div>
  );
}

export default ProductImage;
