export type InputType = 'geninfo' | 'productName' | 'productTitle' | 'list';
export type Language = 'uk' | 'en';

export interface LocalizedValue {
  uk: string;
  en: string;
}

export interface ListItem {
  id: string;
  content: LocalizedValue;
  sublist?: ListItem[];
}

export interface InputField {
  id: string;
  type: InputType;
  label: string;
  value: LocalizedValue;
  items?: ListItem[];
}

// Type for updateListItem function
export type UpdateListItemFunction = (
  inputId: string,
  itemId: string,
  language: Language,
  value: string
) => void;

// Type for updateSublistItem function
export type UpdateSublistItemFunction = (
  inputId: string,
  itemId: string,
  subItemId: string,
  language: Language,
  value: string
) => void;
