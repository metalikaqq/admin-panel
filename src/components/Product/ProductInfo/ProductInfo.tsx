"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Product/ProductInfo/ProductInfo.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import s from "./ProductInfo.module.scss";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

type InputType = "geninfo" | "productName" | "productTitle" | "list";

const inputTypes: Record<InputType, string> = {
  geninfo: "General Information",
  productName: "Product Name",
  productTitle: "Product Title",
  list: "List",
};

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
  items?: ListItem[]; // For handling list items with sublists
}

function ProductInfo() {
  const [inputs, setInputs] = useState<InputField[]>([
    { id: "1", type: "productName", label: "Product Name", value: "" },
    { id: "2", type: "productTitle", label: "Product Title", value: "" },
    { id: "3", type: "geninfo", label: "General Information", value: "" },
  ]);

  const moveInputUp = (index: number) => {
    if (index > 0) {
      const newInputs = [...inputs];
      [newInputs[index - 1], newInputs[index]] = [newInputs[index], newInputs[index - 1]];
      setInputs(newInputs);
    }
  };

  const moveInputDown = (index: number) => {
    if (index < inputs.length - 1) {
      const newInputs = [...inputs];
      [newInputs[index + 1], newInputs[index]] = [newInputs[index], newInputs[index + 1]];
      setInputs(newInputs);
    }
  };

  const addInput = (type: InputType) => {
    const newInput: InputField = {
      id: Date.now().toString(),
      type,
      label: inputTypes[type],
      value: "",
      items: type === "list" ? [{ id: Date.now().toString(), content: "", sublist: [] }] : undefined,
    };
    setInputs([...inputs, newInput]);
  };

  const removeInput = (id: string) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const updateInputValue = (id: string, value: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
  };

  const addListItem = (id: string) => {
    setInputs(inputs.map(input =>
      input.id === id && input.items
        ? { ...input, items: [...input.items, { id: Date.now().toString(), content: "", sublist: [] }] }
        : input
    ));
  };

  const addSublistItem = (id: string, itemId: string) => {
    setInputs(inputs.map(input => {
      if (input.id === id && input.items) {
        const updatedItems = input.items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              sublist: [...(item.sublist || []), { id: Date.now().toString(), content: "" }]
            };
          }
          return item;
        });
        return { ...input, items: updatedItems };
      }
      return input;
    }));
  };

  const updateListItem = (inputId: string, itemId: string, value: string) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId && input.items) {
        const updatedItems = input.items.map(item => {
          if (item.id === itemId) {
            return { ...item, content: value };
          }
          return item;
        });
        return { ...input, items: updatedItems };
      }
      return input;
    }));
  };

  const updateSublistItem = (inputId: string, itemId: string, subItemId: string, value: string) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId && input.items) {
        const updatedItems = input.items.map(item => {
          if (item.id === itemId && item.sublist) {
            const updatedSublist = item.sublist.map(subItem => {
              if (subItem.id === subItemId) {
                return { ...subItem, content: value };
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
    }));
  };

  return (
    <div className={s.product__info}>
      <h3>Product Information</h3>

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
                className={`${s.arrowButton} ${index === 0 ? s.disabled : ""}`}
                onClick={() => moveInputUp(index)}
                disabled={index === 0}
                title="Move Up"
              >
                <ArrowUpwardIcon />
              </button>
              <button
                className={`${s.arrowButton} ${index === inputs.length - 1 ? s.disabled : ""}`}
                onClick={() => moveInputDown(index)}
                disabled={index === inputs.length - 1}
                title="Move Down"
              >
                <ArrowDownwardIcon />
              </button>
            </div>

            <div className={s.inputContent}>
              <p className={s.product__name__title}>{input.label}</p>

              {input.type === "list" && input.items ? (
                <div className={s.listContainer}>
                  {input.items.map((item) => (
                    <div key={item.id} className={s.listItem}>
                      <input
                        type="text"
                        className={s.product__name__input}
                        value={item.content}
                        onChange={(e) => updateListItem(input.id, item.id, e.target.value)}
                        placeholder="List Item"
                      />
                      <button
                        onClick={() => addSublistItem(input.id, item.id)}
                        className={s.addButton}
                      >
                        Add Sublist Item
                      </button>

                      {item.sublist && item.sublist.map((subItem) => (
                        <div key={subItem.id} className={s.sublistItem}>
                          <input
                            type="text"
                            className={s.product__name__input}
                            value={subItem.content}
                            onChange={(e) => updateSublistItem(input.id, item.id, subItem.id, e.target.value)}
                            placeholder="Sublist Item"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  <button onClick={() => addListItem(input.id)} className={s.addButton}>
                    Add List Item
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  className={s.product__name__input}
                  value={input.value}
                  onChange={(e) => updateInputValue(input.id, e.target.value)}
                />
              )}

              <button
                onClick={() => removeInput(input.id)}
                className={s.removeButton}
                title="Remove Input"
              >
                <DeleteIcon />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className={s.addInputSection}>
        <h4>Add New Input</h4>
        <div className={s.buttonContainer}>
          {Object.keys(inputTypes).map((type) => (
            <button
              key={type}
              onClick={() => addInput(type as InputType)}
              className={s.addButton}
            >
              Add {inputTypes[type as InputType]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
