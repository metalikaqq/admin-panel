/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useEffect } from 'react';
import s from './ProductScroll.module.scss';

interface ProductScrollProps {
  productInfo: any;
  onHtmlGenerated: (html: string) => void; // Callback to pass generated HTML
}

export default function ProductScroll({ productInfo, onHtmlGenerated }: ProductScrollProps) {
  function generateProductInfoHTML(productInfo: any[]): string {
    return productInfo
      .map((item) => {
        let htmlContent = '';

        switch (item.type) {
          case 'productName':
            htmlContent = `<strong><h1>${item.value}</h1></strong>`;
            break;
          case 'productTitle':
            htmlContent = `<strong><span>${item.value}</span></strong>`;
            break;
          case 'geninfo':
            htmlContent = `<span>${item.value}</span>`;
            break;
          case 'list':
            htmlContent = generateListHTML(item.items);
            break;
          default:
            htmlContent = `<span>${item.value}</span>`; // Fallback for unknown types
        }

        return htmlContent;
      })
      .join('<br>'); // Add a line break after each element
  }

  // Helper function to generate nested list HTML
  function generateListHTML(items: any[]): string {
    return `
      <ul>
        ${items
        .map(
          (item) => `
          <li>${item.content}
            ${item.sublist && item.sublist.length > 0
              ? generateListHTML(item.sublist)
              : ''
            }
          </li>
        `
        )
        .join('')}
      </ul>
    `;
  }

  // Generate HTML and pass it to the parent component
  useEffect(() => {
    if (productInfo) {
      const html = generateProductInfoHTML(productInfo);
      onHtmlGenerated(html); // Pass the generated HTML back to the parent
    }
  }, [productInfo, onHtmlGenerated]);

  return (
    <div className={s.productScroll}>
      <div className={s.productContent}>
        <div
          dangerouslySetInnerHTML={{
            __html: productInfo
              ? generateProductInfoHTML(productInfo)
              : 'No product information available.',
          }}
        />
      </div>
      <div className={s.productButtons}>
        <a
          href="https://cdn.shopify.com/s/files/1/0664/4275/6332/files/24X30CASEV5.00A4_1.pdf?v=1664743615"
          className={s.link}
        >
          Download PDF
        </a>
        <button className={s.accordion}>Specifications</button>
        <button className={s.accordion}>Shipping Info</button>
        <div className={s.social}>
          <a href="#" className={s.share}>Share</a>
          <a href="#" className={s.pin}>Pin</a>
        </div>
      </div>
    </div>
  );
}