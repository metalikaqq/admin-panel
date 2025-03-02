// store/useProductStore.ts
import { create } from 'zustand';

// Типы из ProductInfo
type InputType = 'geninfo' | 'productName' | 'productTitle' | 'list';

interface ListItem {
  id: string;
  content: string;
  sublist?: ListItem[];
}

interface InputField {
  id: string;
  type: InputType;
  label: string;
  value: string;
  items?: ListItem[];
}

interface ProductState {
  // Изображения продукта
  productImages: string[];

  // Информация о продукте
  productInfo: InputField[];

  // Действия для изображений
  setProductImages: (images: string[]) => void;
  updateImageAtIndex: (index: number, image: string) => void;
  addMoreImageSlots: (count: number) => void;

  // Действия для информации о продукте
  setProductInfo: (info: InputField[]) => void;
  updateProductInfo: (newInfo: InputField[]) => void;

  // Действие для сохранения всех данных в sessionStorage
  saveToSessionStorage: () => void;
  loadFromSessionStorage: () => boolean;
}

export const useProductStore = create<ProductState>((set, get) => ({
  productImages: Array(9).fill(''), // Инициализируем с 9 пустыми слотами

  productInfo: [
    { id: '1', type: 'productName', label: 'Product Name', value: '' },
    { id: '2', type: 'productTitle', label: 'Product Title', value: '' },
    { id: '3', type: 'geninfo', label: 'General Information', value: '' },
  ],

  // Действия для изображений
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

  // Действия для информации о продукте
  setProductInfo: (info) => set({ productInfo: info }),

  updateProductInfo: (newInfo) => set({ productInfo: newInfo }),

  // Сохранение всех данных в sessionStorage
  saveToSessionStorage: () => {
    const { productImages, productInfo } = get();
    const productData = { productImages, productInfo };
    sessionStorage.setItem('productData', JSON.stringify(productData));
  },

  // Загрузка данных из sessionStorage
  loadFromSessionStorage: () => {
    const storedData = sessionStorage.getItem('productData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        set({
          productImages: parsedData.productImages || Array(9).fill(''),
          productInfo: parsedData.productInfo || [],
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
