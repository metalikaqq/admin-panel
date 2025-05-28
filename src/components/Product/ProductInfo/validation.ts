/* eslint-disable @typescript-eslint/no-unused-vars */
// Validation utilities for product information
import { InputField, InputType, ListItem } from './types';

export interface ValidationError {
  fieldId: string;
  message: string;
}

export const validateProductInfo = (
  inputs: InputField[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  inputs.forEach((input) => {
    // Validate required fields
    if (input.type === 'productName' || input.type === 'productTitle') {
      if (!input.value.uk.trim()) {
        errors.push({
          fieldId: input.id,
          message: `${input.label} in Ukrainian is required`,
        });
      }
      if (!input.value.en.trim()) {
        errors.push({
          fieldId: input.id,
          message: `${input.label} in English is required`,
        });
      }
    }

    // Validate list items if present
    if (input.type === 'list' && input.items) {
      validateListItems(input.id, input.items, errors);
    }
  });

  return errors;
};

const validateListItems = (
  inputId: string,
  items: ListItem[],
  errors: ValidationError[]
): void => {
  items.forEach((item, index) => {
    // Check if list item content is empty
    if (!item.content.uk.trim()) {
      errors.push({
        fieldId: `${inputId}_item_${item.id}_uk`,
        message: `List item ${index + 1} Ukrainian content is required`,
      });
    }

    if (!item.content.en.trim()) {
      errors.push({
        fieldId: `${inputId}_item_${item.id}_en`,
        message: `List item ${index + 1} English content is required`,
      });
    }

    // Check sublist items if present
    if (item.sublist && item.sublist.length > 0) {
      validateListItems(`${inputId}_item_${item.id}`, item.sublist, errors);
    }
  });
};

export const isFormValid = (inputs: InputField[]): boolean => {
  return validateProductInfo(inputs).length === 0;
};
