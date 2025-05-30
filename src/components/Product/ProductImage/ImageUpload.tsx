import React from 'react';
import { Box, Typography } from '@mui/material';

interface ImageUploadProps {
  index: number;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  isMain?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  index,
  onSelect,
  isMain = false,
}) => {
  return (
    <Box
      sx={{
        width: 140,
        height: 120,
        border: '2px dashed #ccc',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#007FFF',
          background: 'rgba(0,127,255,0.04)',
        },
        position: 'relative',
      }}
      component="label"
    >
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onSelect(e, index)}
      />
      <Box
        component="span"
        sx={{
          fontSize: '24px',
          color: '#999',
          marginBottom: '4px',
          display: 'block',
        }}
      >
        +
      </Box>
      <Typography variant="caption" color="text.secondary">
        {isMain ? 'Upload Main Image' : 'Upload Image'}
      </Typography>
    </Box>
  );
};

export default ImageUpload;
