import React, { useEffect, useRef } from 'react';
import s from './ProductScroll.module.scss';
import { useProductStore } from '@/store/useProductStore';

interface LocalizedValue {
  uk: string;
  en: string;
}

interface ListItem {
  id: string;
  content: LocalizedValue;
  sublist?: ListItem[];
}

interface InputField {
  id: string;
  type: string;
  label: string;
  value: LocalizedValue;
  items?: ListItem[];
}

interface ProductScrollProps {
  productInfo: InputField[];
  activeLanguage: 'uk' | 'en';
  onHtmlGenerated: (htmlContent: { uk: string; en: string }) => void;
}

export default function ProductScroll({ productInfo, activeLanguage, onHtmlGenerated }: ProductScrollProps) {
  const { setActiveLanguage } = useProductStore();
  // Використовуємо useRef для відстеження попередніх значень
  const prevProductInfoRef = useRef<string>('');

  // Генерація HTML для відображення на сторінці
  function generateProductInfoHTML(productInfo: InputField[], language: 'uk' | 'en'): string {
    return productInfo
      .map((item) => {
        let htmlContent = '';

        switch (item.type) {
          case 'productName':
            htmlContent = `<strong><h1>${item.value[language] || ''}</h1></strong>`;
            break;
          case 'productTitle':
            htmlContent = `<strong><span>${item.value[language] || ''}</span></strong>`;
            break;
          case 'geninfo':
            htmlContent = `<span>${item.value[language] || ''}</span>`;
            break;
          case 'list':
            if (item.items) {
              htmlContent = generateListHTML(item.items, language);
            }
            break;
          default:
            htmlContent = `<span>${item.value[language] || ''}</span>`;
        }

        return htmlContent;
      })
      .join('<br>');
  }

  // Helper function to generate nested list HTML
  function generateListHTML(items: ListItem[], language: 'uk' | 'en'): string {
    return `
      <ul>
        ${items
        .map(
          (item) => `
            <li>${item.content[language] || ''}
              ${item.sublist && item.sublist.length > 0
              ? generateListHTML(item.sublist, language)
              : ''
            }
            </li>
          `
        )
        .join('')}
      </ul>
    `;
  }

  // Handle language change
  const handleLanguageChange = (language: 'uk' | 'en') => {
    setActiveLanguage(language);
  };

  // Generate HTML and pass it to the parent component
  useEffect(() => {
    if (!productInfo || productInfo.length === 0) return;

    // Перевіряємо, чи змінилася інформація про продукт
    const productInfoString = JSON.stringify(productInfo);
    if (productInfoString === prevProductInfoRef.current) return;

    // Оновлюємо посилання на поточні дані
    prevProductInfoRef.current = productInfoString;

    // Генеруємо HTML для обох мов
    const htmlContent = {
      uk: generateProductInfoHTML(productInfo, 'uk'),
      en: generateProductInfoHTML(productInfo, 'en')
    };

    // Передаємо згенерований HTML назад батьківському компоненту
    onHtmlGenerated(htmlContent);
  }, [productInfo, onHtmlGenerated]);

  return (
    <div className={s.productScroll}>
      <div className={s.languageSwitcher}>
        <button
          className={`${s.languageButton} ${activeLanguage === 'uk' ? s.active : ''}`}
          onClick={() => handleLanguageChange('uk')}
        >
          Ukrainian
        </button>
        <button
          className={`${s.languageButton} ${activeLanguage === 'en' ? s.active : ''}`}
          onClick={() => handleLanguageChange('en')}
        >
          English
        </button>
      </div>
      <div className={s.productContent}>
        <div
          dangerouslySetInnerHTML={{
            __html: productInfo
              ? generateProductInfoHTML(productInfo, activeLanguage)
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
