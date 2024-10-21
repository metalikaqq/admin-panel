/* eslint-disable @typescript-eslint/no-explicit-any */

import s from './ProductScroll.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductScroll({ productInfo }: any) {
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
            ${
              item.sublist && item.sublist.length > 0
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
  // console.log(generateProductInfoHTML(productInfo));
  console.log(productInfo);

  return (
    <div className={s.productScroll}>
      <div className={s.productContent}>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: productInfo
                ? generateProductInfoHTML(productInfo)
                : 'No product information available.',
            }}
          />
          ;
        </div>
      </div>

      <div className={s.productButtons}>
        <a
          href="https://cdn.shopify.com/s/files/1/0664/4275/6332/files/24X30CASEV5.00A4_1.pdf?v=1664743615"
          className={s.link}
        >
          {}
        </a>

        {/* <button onClick={openModal} className={s.button__blue}>
          {productInfo.ContactUsButton}
        </button> */}

        <div>
          {/* <EmailForm selectedValue={productInfo.title} /> */}
          dsd
        </div>

        <button className={s.accordion}>Specifications</button>
        <button className={s.accordion}>Shipping Info</button>
        <div className={s.social}>
          <a href="#" className={s.share}>
            Share
          </a>
          <a href="#" className={s.pin}>
            Pin
          </a>
        </div>
      </div>
    </div>
  );
}
