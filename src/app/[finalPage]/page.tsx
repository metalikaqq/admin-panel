/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useEffect, useState } from "react";
// import s from "./page.module.scss";
// import Image from "next/image";

// export default function FinalPage() {
//   const [productData, setProductData] = useState<{
//     productInfo: any;
//     productImages: { src: string; alt: string }[];
//   }>({
//     productInfo: null,
//     productImages: [],
//   });

//   // Fetch product data from sessionStorage when the page loads
//   useEffect(() => {
//     const storedProductData = sessionStorage.getItem("productData");
//     if (storedProductData) {
//       setProductData(JSON.parse(storedProductData));
//     }
//   }, []);

// Function to generate HTML for productInfo

//   return (
//     <div className={s.main}>

//       <h2>Product Images</h2>
//       <div className={s.imageGallery}>
//         {productData.productImages && productData.productImages.length > 0 ? (
//           productData.productImages.map((image, index) => (
//             <img
//               key={index}
//               src={image.src}
//               alt={image.alt || `Product Image ${index + 1}`}
//               width={200} // You can adjust these dimensions
//               height={200}
//               className={s.productImage}
//             />
//           ))
//         ) : (
//           <p>No images available.</p>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';
import React, { useEffect, useState } from 'react';
import ProductImages from './components/ProductImages/ProductImages';
import ProductScroll from './components/ProductScroll/ProductScroll';
import s from './page.module.scss';
interface ProductData {
  productInfo: any; // Adjust type according to the structure of your product info
  productImages: string[];
}

const FinalPage: React.FC = () => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  // const [processedHTML, setProcessedHTML] = useState<string>("");

  // Retrieve product data from sessionStorage
  // useEffect(() => {
  //   const storedData = sessionStorage.getItem("productData");
  //   if (storedData) {
  //     setProductData(JSON.parse(storedData));
  //   }
  // }, []);

  useEffect(() => {
    const storedData = sessionStorage.getItem('productData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setProductData(parsedData);

      // Generate the processed HTML and store it in the state
      // const generatedHTML = generateProductInfoHTML(parsedData.productInfo);
      // setProcessedHTML(generatedHTML);

      // // Log the generated HTML to the console
      // console.log("Generated HTML:", generatedHTML);
    }
  }, []);

  if (!productData) {
    return <div>Loading...</div>; // In case data is not loaded yet
  }

  const { productImages, productInfo } = productData;

  // return (
  //   <div>
  //     <h1>Product Final View</h1>

  //     {/* Display product information */}
  //     {/* Display product images */}
  //     <div>
  //       <h2>Product Info</h2>

  //       {/* Dynamically generate and insert HTML */}
  // <div
  //   dangerouslySetInnerHTML={{
  //     __html: productData.productInfo
  //       ? generateProductInfoHTML(productInfo)
  //       : "No product information available.",
  //   }}
  // />;
  //       <h2>Product Images</h2>
  //       <div>
  //         {/* {productImages.map((image, index) => (
  //           <div key={index}>
  //             <Image width={300} height={300} src={image} alt={`Product ${index + 1}`} />
  //           </div>
  //         ))} */}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={s.product}>
      {/* <div className={s.product__img_wrapper}> */}
      <ProductImages productImages={productImages} />
      <ProductScroll productInfo={productInfo} />
      {/* </div> */}
    </div>
  );
};

export default FinalPage;
