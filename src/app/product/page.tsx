'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import { theme } from '@/theme';
import ProductStepper from '@/components/Product/ProductStepper/ProductStepper';
import { useProductStore } from '@/store/useProductStore';
import s from './page.module.scss';

export default function ProductPage() {
  const router = useRouter();
  const { productInfo, saveToSessionStorage } = useProductStore();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFinalLook = () => {
    saveToSessionStorage();
    console.log('Product Info:', JSON.stringify(productInfo, null, 2));
    router.push(`/finalPage`);
  };

  return (
    <Container maxWidth="lg" className={s.container}>
      <Box className={s.header} mb={4}>
        <Typography variant="h4" component="h1" className={s.main__name}>
          Add New Product
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create a new product by filling out the information below
        </Typography>
      </Box>

      <ProductStepper />

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleFinalLook}
          fullWidth={isMobile}
        >
          Preview Final Product
        </Button>
      </Box>
    </Container>
  );
}
