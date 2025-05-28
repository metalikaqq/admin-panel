import React from 'react';
import { TextField, IconButton, Tooltip, Box, Button, Typography, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { InputField, Language, ListItem, UpdateListItemFunction } from './types';
import ProductInfoListItem from './ProductInfoListItem';
// import { InputField, Language, UpdateListItemFunction, ListItem } from './types';
// import ProductInfoListItem from './ProductInfoListItem';

interface ProductInfoFieldProps {
  input: InputField;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onValueChange: (language: Language, value: string) => void;
  onListItemChange?: UpdateListItemFunction;
  onAddListItem?: () => void;
  onAddSublistItem?: (itemId: string) => void;
  error?: string;
}

const ProductInfoField: React.FC<ProductInfoFieldProps> = ({
  input,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  onValueChange,
  onListItemChange,
  onAddListItem,
  onAddSublistItem,
  error,
}) => {
  return (
    <Box mb={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Tooltip title="Move Up"><span>
          <IconButton onClick={onMoveUp} disabled={index === 0} size="small"><ArrowUpwardIcon /></IconButton>
        </span></Tooltip>
        <Tooltip title="Move Down"><span>
          <IconButton onClick={onMoveDown} disabled={index === total - 1} size="small"><ArrowDownwardIcon /></IconButton>
        </span></Tooltip>
        <Box flex={1} ml={2} fontWeight={600}>
          {input.label}
          {(input.type === 'productName' || input.type === 'productTitle') && (
            <Chip
              label="Required"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
        <Tooltip title="Remove"><span>
          <IconButton onClick={onRemove} color="error" size="small"><DeleteIcon /></IconButton>
        </span></Tooltip>
      </Box>
      {error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'error.main',
            mb: 1,
            fontSize: '0.85rem'
          }}
        >
          <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="error">{error}</Typography>
        </Box>
      )}
      {input.type === 'list' && input.items ? (
        <Box>
          {input.items.map((item: ListItem) => (
            <ProductInfoListItem
              key={item.id}
              item={item}
              inputId={input.id}
              onListItemChange={onListItemChange}
              onAddSublistItem={onAddSublistItem}
            />
          ))}
          <Box mt={1}>
            <Button variant="outlined" size="small" onClick={onAddListItem}>Add List Item</Button>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          gap={2}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <TextField
            label={`${input.label} (Ukrainian)`}
            value={input.value.uk}
            onChange={e => onValueChange('uk', e.target.value)}
            fullWidth
            size="small"
            error={!!error}
            required={(input.type === 'productName' || input.type === 'productTitle')}
            helperText={(input.type === 'productName' || input.type === 'productTitle') ?
              (input.value.uk.trim() === '' ? 'Required field' : '') : ''}
            sx={{
              '& .MuiInputLabel-asterisk': {
                color: 'red',
              }
            }}
          />
          <TextField
            label={`${input.label} (English)`}
            value={input.value.en}
            onChange={e => onValueChange('en', e.target.value)}
            fullWidth
            size="small"
            error={!!error}
            required={(input.type === 'productName' || input.type === 'productTitle')}
            helperText={(input.type === 'productName' || input.type === 'productTitle') ?
              (input.value.en.trim() === '' ? 'Required field' : '') : ''}
            sx={{
              '& .MuiInputLabel-asterisk': {
                color: 'red',
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductInfoField;
