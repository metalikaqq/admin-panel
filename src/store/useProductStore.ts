// store/useProductStore.ts
import { create } from 'zustand';

// Типи з ProductInfo
type InputType = 'geninfo' | 'productName' | 'productTitle' | 'list';
type Language = 'uk' | 'en';

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
  type: InputType;
  label: string;
  value: LocalizedValue;
  items?: ListItem[];
}

interface ProductState {
  // Зображення продукту
  productImages: string[];

  // Активна мова для перегляду (не для редагування)
  activeLanguage: Language;

  // Інформація про продукт
  productInfo: InputField[];

  // Вибраний тип продукту
  selectedProductTypeId: string | null;

  // Дії для зображень
  setProductImages: (images: string[]) => void;
  updateImageAtIndex: (index: number, image: string) => void;
  addMoreImageSlots: (count: number) => void;

  // Дії для мови
  setActiveLanguage: (language: Language) => void;

  // Дії для інформації про продукт
  setProductInfo: (info: InputField[]) => void;
  updateProductInfo: (newInfo: InputField[]) => void;

  // Дії для типу продукту
  setSelectedProductTypeId: (id: string) => void;

  // Дія для збереження всіх даних в sessionStorage
  saveToSessionStorage: () => void;
  loadFromSessionStorage: () => boolean;
}

export const useProductStore = create<ProductState>((set, get) => ({
  productImages: Array(9).fill(''), // Ініціалізуємо з 9 пустими слотами

  activeLanguage: 'uk', // За замовчуванням українська мова для перегляду

  selectedProductTypeId: null, // Початкове значення для вибраного типу продукту

  productInfo: [
    {
      id: '1',
      type: 'productName',
      label: 'Product Name',
      value: { uk: '', en: '' },
    },
    {
      id: '2',
      type: 'productTitle',
      label: 'Product Title',
      value: { uk: '', en: '' },
    },
    {
      id: '3',
      type: 'geninfo',
      label: 'General Information',
      value: { uk: '', en: '' },
    },
  ],

  // Дія для зміни активної мови (тепер тільки для перегляду)
  setActiveLanguage: (language) => set({ activeLanguage: language }),

  // Дії для зображень
  setProductImages: (images) => set({ productImages: images }),

  updateImageAtIndex: (index, image) =>
    set((state) => {
      const updatedImages = [...state.productImages];
      updatedImages[index] = image;
      return { productImages: updatedImages };
    }),

  addMoreImageSlots: (count) =>
    set((state) => {
      const newImages = [...state.productImages];
      for (let i = 0; i < count; i++) {
        newImages.push('');
      }
      return { productImages: newImages };
    }),

  // Дії для інформації про продукт
  setProductInfo: (info: InputField[]) => set({ productInfo: info }),

  updateProductInfo: (newInfo: InputField[]) => set({ productInfo: newInfo }),

  // Дія для типу продукту
  setSelectedProductTypeId: (id) => set({ selectedProductTypeId: id }),

  // Збереження всіх даних в sessionStorage
  saveToSessionStorage: () => {
    const {
      productImages,
      productInfo,
      activeLanguage,
      selectedProductTypeId,
    } = get();
    const productData = {
      productImages,
      productInfo,
      activeLanguage,
      selectedProductTypeId,
    };
    sessionStorage.setItem('productData', JSON.stringify(productData));
  },

  // Завантаження даних з sessionStorage
  loadFromSessionStorage: () => {
    const storedData = sessionStorage.getItem('productData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        // Перевірка та міграція старих даних, якщо потрібно
        if (parsedData.productInfo && parsedData.productInfo.length > 0) {
          // Перевіряємо, чи старі дані мають структуру з однією мовою
          const needsMigration =
            typeof parsedData.productInfo[0].value === 'string';

          if (needsMigration) {
            // Мігруємо дані до нової структури
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsedData.productInfo = parsedData.productInfo.map((item: any) => {
              if (typeof item.value === 'string') {
                return {
                  ...item,
                  value: { uk: item.value, en: '' },
                };
              }
              return item;
            });
          }
        }

        set({
          productImages: parsedData.productImages || Array(9).fill(''),
          productInfo: parsedData.productInfo || [],
          activeLanguage: parsedData.activeLanguage || 'uk',
          selectedProductTypeId: parsedData.selectedProductTypeId || null,
        });
        return true;
      } catch (error) {
        console.error('Error parsing stored data:', error);
        return false;
      }
    }
    return false;
  },
}));
