'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useProductStore } from '@/store/useProductStore';
import ImagePreview from './ImagePreview';
import ImageUpload from './ImageUpload';

// Helper function to convert image file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface ProductImageProps {
  onUpdate?: (images: string[]) => void; // Optional, for passing images
}

const ProductImage: React.FC<ProductImageProps> = ({ onUpdate }) => {
  const { productImages, updateImageAtIndex, addMoreImageSlots } =
    useProductStore();
  const [imageCount, setImageCount] = useState(8); // Initial count of additional images

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        updateImageAtIndex(index, base64Image);

        if (onUpdate) {
          const updatedImages = useProductStore.getState().productImages;
          onUpdate(updatedImages);
        }
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }
  };

  const addMoreImages = () => {
    setImageCount((prevCount) => prevCount + 4);
    addMoreImageSlots(4);
  };

  const uploadedCount = productImages.filter(Boolean).length;

  const handleRemoveImage = (index: number) => {
    updateImageAtIndex(index, '');
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h3">
          Product Images
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {uploadedCount} of {productImages.length} uploaded
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Main Product Image
        </Typography>
        <Box>
          {productImages[0] ? (
            <ImagePreview
              src={productImages[0]}
              alt="Main product"
              onRemove={() => handleRemoveImage(0)}
            />
          ) : (
            <ImageUpload index={0} onSelect={handleImageChange} isMain />
          )}
        </Box>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Additional Images
      </Typography>
      <Grid container spacing={2}>
        {[...Array(imageCount)].map((_, index) => (
          <Grid item key={index}>
            {productImages[index + 1] ? (
              <ImagePreview
                src={productImages[index + 1]}
                alt={`Product ${index + 1}`}
                onRemove={() => handleRemoveImage(index + 1)}
              />
            ) : (
              <ImageUpload index={index + 1} onSelect={handleImageChange} />
            )}
          </Grid>
        ))}
      </Grid>

      <Box mt={2}>
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={addMoreImages}
          size="small"
        >
          Add More Image Slots
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductImage;
