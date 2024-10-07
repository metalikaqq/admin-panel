// "use client";

// import s from "./ProductImages.module.scss"
// import { Key, useState } from "react";
// import Image from "next/image";
// import { StaticImport } from "next/dist/shared/lib/get-img-props";
// import { useDraggableScroll } from "@/hooks/useDraggableScroll";

// export type ProductImagesProps = {
//   // props go here
// };

// export default function ProductImages(params: any) {


//   const [currentImage, setCurrentImage] = useState(productInfo ? productInfo.images[0] : null);

//   const scrollRef = useDraggableScroll();

//   if (!productInfo) {
//     return <div>Product not found</div>;
//   }

//   return (
//     <div className={s.product_images}>
//       <div className={s.main_image}>
//         {currentImage && (
//           <Image
//             src={currentImage.src}
//             alt={currentImage.alt}
//             layout="responsive"
//             className={s.main_image__inner}
//           />
//         )}
//       </div>

//         <div className={s.thumbnails} ref={scrollRef}>
//           {productInfo.images.map((image: { src: string | StaticImport; alt: string; }, index: Key | null | undefined) => (
//             <div
//               key={index}
//               className={s.thumbnail}
//               onClick={() => setCurrentImage(image)}
//             >
//               <Image
//                 src={image.src}
//                 alt={image.alt}
//                 layout="responsive"
//                 className={s.image}
//               />
//             </div>
//           ))}
//         </div>
//     </div>
//   );
// }
