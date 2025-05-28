import React from 'react';
import { TextField, Box, Button } from '@mui/material';
import { ListItem, UpdateListItemFunction } from './types';
// import { ListItem, Language, UpdateListItemFunction } from './types';

interface ProductInfoListItemProps {
  item: ListItem;
  inputId: string;
  onListItemChange?: UpdateListItemFunction;
  onAddSublistItem?: (itemId: string) => void;
}

const ProductInfoListItem: React.FC<ProductInfoListItemProps> = ({
  item,
  inputId,
  onListItemChange,
  onAddSublistItem,
}) => {
  return (
    <Box mb={1} pl={2} borderLeft="2px solid #eee">
      <Box display="flex" gap={2} mb={1}>
        <TextField
          label="List Item (Ukrainian)"
          value={item.content.uk}
          onChange={e => onListItemChange && onListItemChange(inputId, item.id, 'uk', e.target.value)}
          size="small"
        />
        <TextField
          label="List Item (English)"
          value={item.content.en}
          onChange={e => onListItemChange && onListItemChange(inputId, item.id, 'en', e.target.value)}
          size="small"
        />
        <Button onClick={() => onAddSublistItem && onAddSublistItem(item.id)} size="small">Add Sublist Item</Button>
      </Box>
      {item.sublist && item.sublist.map((subItem) => (
        <Box key={subItem.id} pl={2} mb={1}>
          <TextField
            label="Sublist Item (Ukrainian)"
            value={subItem.content.uk}
            onChange={(e) => {
              if (onListItemChange && inputId) {
                // We need to create a specialized handler for sublist items
                const updatedSublistItem = {
                  ...subItem,
                  content: {
                    ...subItem.content,
                    uk: e.target.value
                  }
                };
                // Find the item in the list
                const parentItem = {
                  ...item,
                  sublist: (item.sublist || []).map(sub =>
                    sub.id === subItem.id ? updatedSublistItem : sub
                  )
                };
                onListItemChange(inputId, item.id, 'uk', JSON.stringify(parentItem));
              }
            }}
            size="small"
            sx={{ mr: 1 }}
          />
          <TextField
            label="Sublist Item (English)"
            value={subItem.content.en}
            onChange={(e) => {
              if (onListItemChange && inputId) {
                // Similar handler for English content
                const updatedSublistItem = {
                  ...subItem,
                  content: {
                    ...subItem.content,
                    en: e.target.value
                  }
                };
                const parentItem = {
                  ...item,
                  sublist: (item.sublist || []).map(sub =>
                    sub.id === subItem.id ? updatedSublistItem : sub
                  )
                };
                onListItemChange(inputId, item.id, 'en', JSON.stringify(parentItem));
              }
            }}
            size="small"
          />
        </Box>
      ))}
    </Box>
  );
};

export default ProductInfoListItem;
