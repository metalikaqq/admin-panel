'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  Category,
  Image,
  AccessTime,
} from '@mui/icons-material';
import s from './page.module.scss';
import { productService, ProductStatistics } from '@/services/productManagementService';

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning';
  suffix?: string;
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        setError('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatCards = (): StatCard[] => {
    if (!statistics) return [];

    return [
      {
        title: 'Total Products',
        value: statistics.totalProducts,
        icon: <Inventory />,
        color: 'primary',
      },
      {
        title: 'Product Types',
        value: statistics.totalProductTypes,
        icon: <Category />,
        color: 'secondary',
      },
      {
        title: 'Recent Products',
        value: statistics.recentProducts,
        icon: <AccessTime />,
        color: 'success',
        suffix: 'last 30 days',
      },
      {
        title: 'Avg Images per Product',
        value: statistics.averageImagesPerProduct.toFixed(1),
        // eslint-disable-next-line jsx-a11y/alt-text
        icon: <Image />,
        color: 'warning',
      },
    ];
  };

  return (
    <Container maxWidth="lg" className={s.container}>
      <Box className={s.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Management Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your product catalog and performance metrics
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {getStatCards().map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className={s.statCard} elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" color={`${card.color}.main`}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      {card.suffix && (
                        <Chip
                          label={card.suffix}
                          size="small"
                          color={card.color}
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Box color={`${card.color}.main`}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Additional Statistics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Insights
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {statistics && (
                  <>
                    <Chip
                      icon={<TrendingUp />}
                      label={`${statistics.recentProducts} products added recently`}
                      color="success"
                      variant="outlined"
                    />
                    <Chip
                      // eslint-disable-next-line jsx-a11y/alt-text
                      icon={<Image />}
                      label={`${(statistics.totalProducts * statistics.averageImagesPerProduct).toFixed(0)} total images`}
                      color="info"
                      variant="outlined"
                    />
                    {statistics.totalProducts > 0 && (
                      <Chip
                        label={`${((statistics.recentProducts / statistics.totalProducts) * 100).toFixed(1)}% growth rate`}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
