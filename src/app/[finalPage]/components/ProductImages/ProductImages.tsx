'use client';

import s from './ProductImages.module.scss';
import { useDraggableScroll } from '@/hooks/useDraggableScroll';
import { useState } from 'react';
import Image from 'next/image';

export type ProductImagesProps = {
  productImages: string[]; // Accept an array of image URLs (string)
};

export default function ProductImages({ productImages }: ProductImagesProps) {
  // Initialize with the first image as the default current image
  const [currentImage, setCurrentImage] = useState<string>(
    productImages[0] || ''
  );

  const scrollRef = useDraggableScroll();

  // Helper to determine if the image is a Blob URL
  const isBlobURL = (url?: string) => url?.startsWith('blob:');

  return (
    <div className={s.product_images}>
      <div className={s.main_image}>
        {currentImage &&
          (isBlobURL(currentImage) ? (
            <img
              src={currentImage}
              alt="Main product"
              className={s.main_image__inner}
            />
          ) : (
            <Image
              src={currentImage}
              alt="Main product"
              layout="responsive"
              width={300} // You can adjust the size as needed
              height={300}
              className={s.main_image__inner}
            />
          ))}
      </div>

      <div className={s.thumbnails} ref={scrollRef}>
        {productImages.map((image, index) => (
          <div
            key={index}
            className={s.thumbnail}
            onClick={() => setCurrentImage(image)}
          >
            {isBlobURL(image) ? (
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={s.image}
              />
            ) : (
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                layout="responsive"
                width={100} // Adjust size for thumbnails
                height={100}
                className={s.image}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
