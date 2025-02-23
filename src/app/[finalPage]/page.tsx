

// 'use client';
// import React, { useEffect, useState } from 'react';
// import ProductImages from './components/ProductImages/ProductImages';
// import ProductScroll from './components/ProductScroll/ProductScroll';
// import s from './page.module.scss';
// interface ProductData {
//   productInfo: unknown; // Adjust type according to the structure of your product info
//   productImages: string[];
// }

// const FinalPage: React.FC = () => {
//   const [productData, setProductData] = useState<ProductData | null>(null);

//   useEffect(() => {
//     const storedData = sessionStorage.getItem('productData');
//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       setProductData(parsedData);
//     }
//   }, []);

//   if (!productData) {
//     return <div>Loading...</div>; // In case data is not loaded yet
//   }

//   const { productImages, productInfo } = productData;


//   return (
//     <div className={s.product}>
//       {/* <div className={s.product__img_wrapper}> */}
//       <ProductImages productImages={productImages} />
//       <div className={s.product__info}>
//         <ProductScroll productInfo={productInfo} />
//         <button>
//           Create Product
//         </button>
//       </div>
//       {/* </div> */}
//     </div>
//   );
// };

// export default FinalPage;

'use client';
import React, { useEffect, useState } from 'react';
import ProductImages from './components/ProductImages/ProductImages';
import ProductScroll from './components/ProductScroll/ProductScroll';
import s from './page.module.scss';

interface ProductData {
  productInfo: InputField[]; // Use the InputField type from ProductInfo
  productImages: string[];
}

interface InputField {
  id: string;
  type: 'geninfo' | 'productName' | 'productTitle' | 'list';
  label: string;
  value: string;
  items?: ListItem[];
}

interface ListItem {
  id: string;
  content: string;
  sublist?: ListItem[];
}

const FinalPage: React.FC = () => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');

  useEffect(() => {
    const storedData = sessionStorage.getItem('productData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setProductData(parsedData);
    }
  }, []);

  const handleCreateProduct = async () => {
    if (!productData) return;

    // Extract all productName values from productInfo
    const productNames = productData.productInfo
      .filter((input) => input.type === 'productName')
      .map((input) => input.value);

    const payload = {
      productNames, // Array of productName values
      productImages: productData.productImages,
      htmlContent: generatedHtml,
    };

    console.log('Creating product:', payload);

    try {
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
        console.error('Failed to create product');
        alert('Failed to create product. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  const { productImages, productInfo } = productData;

  return (
    <div className={s.product}>
      <ProductImages productImages={productImages} />
      <div className={s.product__info}>
        <ProductScroll
          productInfo={productInfo}
          onHtmlGenerated={(html: string) => setGeneratedHtml(html)}
        />
        <button className={s.createButton} onClick={handleCreateProduct}>
          Create Product
        </button>
      </div>
    </div>
  );
};

export default FinalPage;
