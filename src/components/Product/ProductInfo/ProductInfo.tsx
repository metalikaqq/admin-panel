'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './ProductInfo.module.scss';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProductStore } from '@/store/useProductStore';

type InputType = 'geninfo' | 'productName' | 'productTitle' | 'list';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Language = 'uk' | 'en';

interface LocalizedValue {
  uk: string;
  en: string;
}

const inputTypes: Record<InputType, string> = {
  geninfo: 'General Information',
  productName: 'Product Name',
  productTitle: 'Product Title',
  list: 'List',
};

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

interface ProductInfoProps {
  onUpdate?: (inputs: InputField[]) => void; // Необов'язковий
}

function ProductInfo({ onUpdate }: ProductInfoProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { productInfo, updateProductInfo, activeLanguage } = useProductStore();

  // Використовуємо локальний стан для управління формою
  const [inputs, setInputs] = React.useState<InputField[]>(productInfo);

  // Оновлюємо Zustand store при зміні локального стану
  useEffect(() => {
    updateProductInfo(inputs);

    // Якщо передано onUpdate, викликаємо його також
    if (onUpdate) {
      onUpdate(inputs);
    }

    // Логування для дебагу
  }, [inputs, updateProductInfo, onUpdate]);

  // При першому завантаженні компоненту синхронізуємо з Zustand
  useEffect(() => {
    setInputs(productInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveInputUp = (index: number) => {
    if (index > 0) {
      const newInputs = [...inputs];
      [newInputs[index - 1], newInputs[index]] = [
        newInputs[index],
        newInputs[index - 1],
      ];
      setInputs(newInputs);
    }
  };

  const moveInputDown = (index: number) => {
    if (index < inputs.length - 1) {
      const newInputs = [...inputs];
      [newInputs[index + 1], newInputs[index]] = [
        newInputs[index],
        newInputs[index + 1],
      ];
      setInputs(newInputs);
    }
  };

  const addInput = (type: InputType) => {
    const newInput: InputField = {
      id: Date.now().toString(),
      type,
      label: inputTypes[type],
      value: { uk: '', en: '' },
      items:
        type === 'list'
          ? [
            {
              id: Date.now().toString(),
              content: { uk: '', en: '' },
              sublist: [],
            },
          ]
          : undefined,
    };
    setInputs([...inputs, newInput]);
  };

  const removeInput = (id: string) => {
    const inputToDelete = inputs.find((input) => input.id === id);
    if (inputToDelete?.type === 'productName') {
      const productNameCount = inputs.filter(
        (input) => input.type === 'productName'
      ).length;
      if (productNameCount <= 1) {
        toast.warning('At least one Product Name is required.');
        return;
      }
    }
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const updateInputValue = (id: string, language: Language, value: string) => {
    setInputs(
      inputs.map((input) =>
        input.id === id
          ? {
            ...input,
            value: {
              ...input.value,
              [language]: value,
            },
          }
          : input
      )
    );
  };

  const addListItem = (id: string) => {
    setInputs(
      inputs.map((input) =>
        input.id === id && input.items
          ? {
            ...input,
            items: [
              ...input.items,
              {
                id: Date.now().toString(),
                content: { uk: '', en: '' },
                sublist: [],
              },
            ],
          }
          : input
      )
    );
  };

  const addSublistItem = (id: string, itemId: string) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === id && input.items) {
          const updatedItems = input.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                sublist: [
                  ...(item.sublist || []),
                  { id: Date.now().toString(), content: { uk: '', en: '' } },
                ],
              };
            }
            return item;
          });
          return { ...input, items: updatedItems };
        }
        return input;
      })
    );
  };

  const updateListItem = (
    inputId: string,
    itemId: string,
    language: Language,
    value: string
  ) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === inputId && input.items) {
          const updatedItems = input.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                content: {
                  ...item.content,
                  [language]: value,
                },
              };
            }
            return item;
          });
          return { ...input, items: updatedItems };
        }
        return input;
      })
    );
  };

  const updateSublistItem = (
    inputId: string,
    itemId: string,
    subItemId: string,
    language: Language,
    value: string
  ) => {
    setInputs(
      inputs.map((input) => {
        if (input.id === inputId && input.items) {
          const updatedItems = input.items.map((item) => {
            if (item.id === itemId && item.sublist) {
              const updatedSublist = item.sublist.map((subItem) => {
                if (subItem.id === subItemId) {
                  return {
                    ...subItem,
                    content: {
                      ...subItem.content,
                      [language]: value,
                    },
                  };
                }
                return subItem;
              });
              return { ...item, sublist: updatedSublist };
            }
            return item;
          });
          return { ...input, items: updatedItems };
        }
        return input;
      })
    );
  };

  return (
    <div className={s.product__info}>
      <div className={s.headerWithLanguage}>
        <h3>Product Information</h3>
      </div>

      <AnimatePresence>
        {inputs.map((input, index) => (
          <motion.div
            key={input.id}
            className={s.product__name__wrapper}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            layout
            transition={{ duration: 0.3 }}
          >
            <div className={s.arrowContainer}>
              <button
                className={`${s.arrowButton} ${index === 0 ? s.disabled : ''}`}
                onClick={() => moveInputUp(index)}
                disabled={index === 0}
                title="Move Up"
              >
                <ArrowUpwardIcon />
              </button>
              <button
                className={`${s.arrowButton} ${index === inputs.length - 1 ? s.disabled : ''}`}
                onClick={() => moveInputDown(index)}
                disabled={index === inputs.length - 1}
                title="Move Down"
              >
                <ArrowDownwardIcon />
              </button>
            </div>

            <div className={s.inputContent}>
              <p className={s.product__name__title}>{input.label}</p>

              {input.type === 'list' && input.items ? (
                <div className={s.listContainer}>
                  {input.items.map((item) => (
                    <div key={item.id} className={s.listItem}>
                      {/* Українська версія */}
                      <div className={s.languageField}>
                        <label className={s.languageLabel}>Ukrainian:</label>
                        <input
                          type="text"
                          className={s.product__name__input}
                          value={item.content.uk}
                          onChange={(e) =>
                            updateListItem(
                              input.id,
                              item.id,
                              'uk',
                              e.target.value
                            )
                          }
                          placeholder="List Item (Ukrainian)"
                        />
                      </div>

                      {/* Англійська версія */}
                      <div className={s.languageField}>
                        <label className={s.languageLabel}>English:</label>
                        <input
                          type="text"
                          className={s.product__name__input}
                          value={item.content.en}
                          onChange={(e) =>
                            updateListItem(
                              input.id,
                              item.id,
                              'en',
                              e.target.value
                            )
                          }
                          placeholder="List Item (English)"
                        />
                      </div>

                      <button
                        onClick={() => addSublistItem(input.id, item.id)}
                        className={s.addButton}
                      >
                        Add Sublist Item
                      </button>

                      {item.sublist &&
                        item.sublist.map((subItem) => (
                          <div key={subItem.id} className={s.sublistItem}>
                            {/* Українська версія підпункту */}
                            <div className={s.languageField}>
                              <label className={s.languageLabel}>
                                Ukrainian:
                              </label>
                              <input
                                type="text"
                                className={s.product__name__input}
                                value={subItem.content.uk}
                                onChange={(e) =>
                                  updateSublistItem(
                                    input.id,
                                    item.id,
                                    subItem.id,
                                    'uk',
                                    e.target.value
                                  )
                                }
                                placeholder="Sublist Item (Ukrainian)"
                              />
                            </div>

                            {/* Англійська версія підпункту */}
                            <div className={s.languageField}>
                              <label className={s.languageLabel}>
                                English:
                              </label>
                              <input
                                type="text"
                                className={s.product__name__input}
                                value={subItem.content.en}
                                onChange={(e) =>
                                  updateSublistItem(
                                    input.id,
                                    item.id,
                                    subItem.id,
                                    'en',
                                    e.target.value
                                  )
                                }
                                placeholder="Sublist Item (English)"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem(input.id)}
                    className={s.addButton}
                  >
                    Add List Item
                  </button>
                </div>
              ) : (
                <div className={s.languageFields}>
                  {/* Українська версія */}
                  <div className={s.languageField}>
                    <label className={s.languageLabel}>Ukrainian:</label>
                    <input
                      type="text"
                      className={s.product__name__input}
                      value={input.value.uk}
                      onChange={(e) =>
                        updateInputValue(input.id, 'uk', e.target.value)
                      }
                      placeholder={`${input.label} (Ukrainian)`}
                    />
                  </div>

                  {/* Англійська версія */}
                  <div className={s.languageField}>
                    <label className={s.languageLabel}>English:</label>
                    <input
                      type="text"
                      className={s.product__name__input}
                      value={input.value.en}
                      onChange={(e) =>
                        updateInputValue(input.id, 'en', e.target.value)
                      }
                      placeholder={`${input.label} (English)`}
                    />
                  </div>
                </div>
              )}

              <button
                className={s.deleteButton}
                onClick={() => removeInput(input.id)}
                title="Remove"
              >
                <DeleteIcon />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className={s.addInputWrapper}>
        <h4>Add New Field</h4>
        <button onClick={() => addInput('productName')} className={s.addButton}>
          Add Product Name
        </button>
        <button
          onClick={() => addInput('productTitle')}
          className={s.addButton}
        >
          Add Product Title
        </button>
        <button onClick={() => addInput('geninfo')} className={s.addButton}>
          Add General Information
        </button>
        <button onClick={() => addInput('list')} className={s.addButton}>
          Add List
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;
