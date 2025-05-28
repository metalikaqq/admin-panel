import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, onRemove }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 140,
        height: 120,
        borderRadius: 1,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover .remove-button': {
          opacity: 1,
        }
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={140}
        height={120}
        style={{ objectFit: 'cover' }}
      />
      <Box
        className="remove-button"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'rgba(255,0,0,0.7)',
          color: 'white',
          width: 24,
          height: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity 0.2s',
          '&:hover': {
            background: 'rgba(255,0,0,0.9)',
          }
        }}
        onClick={onRemove}
      >
        <Typography variant="body2" fontWeight="bold">×</Typography>
      </Box>
    </Box>
  );
};

export default ImagePreview;
