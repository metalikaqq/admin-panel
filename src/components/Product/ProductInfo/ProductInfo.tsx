/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, Alert, AlertTitle, Collapse } from '@mui/material';
import s from './ProductInfo.module.scss';
import ProductInfoField from './ProductInfoField';
import { validateProductInfo, ValidationError, isFormValid } from './validation';

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
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  // Оновлюємо Zustand store при зміні локального стану
  useEffect(() => {
    updateProductInfo(inputs);

    // Validate inputs whenever they change
    const errors = validateProductInfo(inputs);
    setValidationErrors(errors);

    // Якщо передано onUpdate, викликаємо його також
    if (onUpdate) {
      onUpdate(inputs);
    }
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
    try {
      // Generate a unique ID for the new sublist item
      const newSubItemId = `subitem_${Date.now().toString()}`;

      setInputs(
        inputs.map((input) => {
          if (input.id === id && input.items) {
            const updatedItems = input.items.map((item) => {
              if (item.id === itemId) {
                // Initialize empty sublist array if it doesn't exist
                const currentSublist = item.sublist || [];

                // Check for duplicate IDs (shouldn't happen with timestamp-based IDs, but just to be safe)
                const isDuplicate = currentSublist.some(subItem => subItem.id === newSubItemId);
                if (isDuplicate) {
                  console.warn("Duplicate sublist item ID detected, generating new ID");
                  return item; // Skip this update to avoid duplicates
                }

                // Add new sublist item with empty content
                return {
                  ...item,
                  sublist: [
                    ...currentSublist,
                    {
                      id: newSubItemId,
                      content: { uk: '', en: '' }
                    },
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

      toast.success("Sublist item added");
    } catch (error) {
      console.error("Error adding sublist item:", error);
      toast.error("Failed to add sublist item");
    }
  };

  const updateListItem = (
    inputId: string,
    itemId: string,
    language: Language,
    value: string
  ) => {
    try {
      // Check if the value is a JSON string (indicates a sublist update)
      let isSublistUpdate = false;
      let parsedItem: ListItem | null = null;

      try {
        parsedItem = JSON.parse(value);
        isSublistUpdate = !!parsedItem && typeof parsedItem === 'object' && !!parsedItem.sublist;
      } catch (e) {
        // Not a JSON string, regular list item update
        isSublistUpdate = false;
      }

      setInputs(
        inputs.map((input) => {
          if (input.id === inputId && input.items) {
            const updatedItems = input.items.map((item) => {
              if (item.id === itemId) {
                if (isSublistUpdate && parsedItem) {
                  // If this is a sublist update, replace the entire item
                  return parsedItem;
                } else {
                  // Regular content update
                  return {
                    ...item,
                    content: {
                      ...item.content,
                      [language]: value,
                    },
                  };
                }
              }
              return item;
            });
            return { ...input, items: updatedItems };
          }
          return input;
        })
      );
    } catch (error) {
      console.error("Error updating list item:", error);
      toast.error("Failed to update list item");
    }
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            layout
            transition={{ duration: 0.3 }}
          >
            <ProductInfoField
              input={input}
              index={index}
              total={inputs.length}
              onMoveUp={() => moveInputUp(index)}
              onMoveDown={() => moveInputDown(index)}
              onRemove={() => removeInput(input.id)}
              onValueChange={(lang, value) => updateInputValue(input.id, lang, value)}
              onListItemChange={updateListItem}
              onAddListItem={() => addListItem(input.id)}
              onAddSublistItem={(itemId) => addSublistItem(input.id, itemId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className={s.addInputWrapper}>
        <h4>Add New Field</h4>
        <button onClick={() => addInput('productName')} className={s.addButton}>
          Add Product Name
        </button>
        <button onClick={() => addInput('productTitle')} className={s.addButton}>
          Add Product Title
        </button>
        <button onClick={() => addInput('geninfo')} className={s.addButton}>
          Add General Information
        </button>
        <button onClick={() => addInput('list')} className={s.addButton}>
          Add List
        </button>

        {validationErrors.length > 0 && (
          <div className={s.validationContainer}>
            <button
              className={s.validateButton}
              onClick={() => setShowValidation(!showValidation)}
            >
              Show Validation Issues ({validationErrors.length})
            </button>
            {showValidation && (
              <div className={s.errorsContainer}>
                {validationErrors.map((error, idx) => (
                  <div key={idx} className={s.errorItem}>
                    {error.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;
