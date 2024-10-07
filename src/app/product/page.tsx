// pages/product.tsx
// import Link from "next/link";
import ProductInfo from "@/components/Product/ProductInfo/ProductInfo";
import s from "./page.module.scss";
import ProductImage from "@/components/Product/ProductImage/ProductImage";

export default function ProductPage() {
  return (
    <div className={s.main}>
      <div className={s.leftSection}>
        <div className={s.header}>
          <h1 className={s.main__name}>Add New Product</h1>
          {/* <Link href="/finalPage" className={s.finalPageLink}>
            Final Look
          </Link> */}
        </div>
        <ProductInfo />
      </div>

      <div className={s.rightSection}>
        <ProductImage />
        <button className={s.main__add__product}> final look</button>
      </div>
    </div>
  );
}
