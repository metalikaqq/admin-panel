
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ProductInfo from '@/components/Product/ProductInfo/ProductInfo';
import ProductImage from '@/components/Product/ProductImage/ProductImage';
// import { useProductStore } from '@/store/useProductStore'; // Обновите путь при необходимости
import s from './page.module.scss';
// import { useRouter } from 'next/router';

export default function ProductPage() {
  const router = useRouter();

  const handleFinalLook = () => {
    router.push(`/finalPage`);
  };

  return (
    <div className={s.main}>
      <div className={s.leftSection}>
        <div className={s.header}>
          <h1 className={s.main__name}>Add New Product</h1>
        </div>
        <ProductInfo />
      </div>

      <div className={s.rightSection}>
        <ProductImage />
        <button className={s.main__add__product} onClick={handleFinalLook}>
          Final Look
        </button>
      </div>
    </div>
  );
}