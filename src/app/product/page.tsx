/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductInfo from '@/components/Product/ProductInfo/ProductInfo';
import ProductImage from '@/components/Product/ProductImage/ProductImage';
import s from './page.module.scss';

export default function ProductPage() {
  const [productInfo, setProductInfo] = useState<any>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const router = useRouter();

  const handleFinalLook = () => {
    const productData = {
      productInfo,
      productImages,
    };

    // Save to sessionStorage
    sessionStorage.setItem('productData', JSON.stringify(productData));

    // Navigate to the final page
    router.push(`/finalPage`);
  };

  return (
    <div className={s.main}>
      <div className={s.leftSection}>
        <div className={s.header}>
          <h1 className={s.main__name}>Add New Product</h1>
        </div>
        <ProductInfo onUpdate={(info: any) => setProductInfo(info)} />
      </div>

      <div className={s.rightSection}>
        <ProductImage
          onUpdate={(images: string[]) => setProductImages(images)}
        />
        <button className={s.main__add__product} onClick={handleFinalLook}>
          Final Look
        </button>
      </div>
    </div>
  );
}
