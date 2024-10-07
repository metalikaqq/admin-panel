"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Product/ProductInfo/ProductInfo.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import s from "./ProductInfo.module.scss";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
// Визначення типів входів
type InputType = "geninfo" | "subtitle" | "productName" | "productTitle";

const inputTypes: Record<InputType, string> = {
  geninfo: "General Information",
  subtitle: "Subtitle",
  productName: "Product Name",
  productTitle: "Product Title",
};

interface InputField {
  id: string;
  type: InputType;
  label: string;
  value: string;
}

function ProductInfo() {
  const [inputs, setInputs] = useState<InputField[]>([
    { id: "1", type: "productName", label: "Product Name", value: "" },
    { id: "2", type: "productTitle", label: "Product Title", value: "" },
    { id: "3", type: "geninfo", label: "General Information", value: "" },
    { id: "4", type: "geninfo", label: "General Information 2", value: "" },
    { id: "5", type: "geninfo", label: "General Information 3", value: "" },
    { id: "6", type: "subtitle", label: "Subtitle", value: "" },
  ]);

  // Перемістити вхід вгору
  const moveInputUp = (index: number) => {
    if (index > 0) {
      const newInputs = [...inputs];
      [newInputs[index - 1], newInputs[index]] = [newInputs[index], newInputs[index - 1]];
      setInputs(newInputs);
    }
  };

  // Перемістити вхід вниз
  const moveInputDown = (index: number) => {
    if (index < inputs.length - 1) {
      const newInputs = [...inputs];
      [newInputs[index + 1], newInputs[index]] = [newInputs[index], newInputs[index + 1]];
      setInputs(newInputs);
    }
  };

  // Додати новий вхід
  const addInput = (type: InputType) => {
    const newInput: InputField = {
      id: Date.now().toString(),
      type,
      label: inputTypes[type],
      value: "",
    };
    setInputs([...inputs, newInput]);
  };

  // Видалити вхід
  const removeInput = (id: string) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  // Оновити значення входу
  const updateInputValue = (id: string, value: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
  };

  return (
    <div className={s.product__info}>
      <h3>Product Information</h3>

      {/* Список входів з анімаціями */}
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
            {/* Контейнер для кнопок переміщення */}
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

            {/* Контент входу */}
            <div className={s.inputContent}>
              <p className={s.product__name__title}>{input.label}</p>
              <input
                type="text"
                className={s.product__name__input}
                value={input.value}
                onChange={(e) => updateInputValue(input.id, e.target.value)}
              />
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

      {/* Розділ додавання нових входів */}
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
