'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import s from './page.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ProductModel } from '@/models/ProductModel';
import { productService } from '@/services/productManagementService';
import { Pagination } from '@/components/UI/Pagination';
import ProductFormModal from './components/ProductFormModal';

export default function ProductManagementPage() {
  // Products state
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Selected product for editing/deleting
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fetch products on component mount and when page changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Function to fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(page, 10);
      if (response.success && response.data) {
        setProducts(response.data);
        // Set total products count from metadata
        if (response.metadata?.total) {
          setTotalProducts(response.metadata.total);
        }
      } else {
        showNotification('Failed to load products', 'error');
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      showNotification('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with selected product
  const handleEdit = (product: ProductModel) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (product: ProductModel) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Handle product deletion
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    setDeleteLoading(true);
    try {
      const response = await productService.deleteProduct(selectedProduct.id);
      if (response.success) {
        // Remove deleted product from the list
        setProducts(products.filter(product => product.id !== selectedProduct.id));
        showNotification('Product deleted successfully', 'success');
      } else {
        showNotification(response.error || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error deleting product', 'error');
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  // Open form modal for creating a new product
  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  // Handle form modal close
  const handleCloseFormModal = (productUpdated: boolean = false) => {
    setIsFormModalOpen(false);
    setSelectedProduct(null);
    // Refresh products list if a product was created or updated
    if (productUpdated) {
      fetchProducts();
    }
  };

  // Function to show notifications
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="lg" className={s.container}>
      <Box className={s.header}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
        >
          Add Product
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={s.tableWrapper}>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table className={s.responsiveTable}>
              <TableHead>
                <TableRow>
                  <TableCell className={s.idColumn}>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell className={s.hideOnMobile}>Type</TableCell>
                  <TableCell className={s.hideOnMobile}>Images</TableCell>
                  <TableCell className={s.hideOnMobile}>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className={s.productRow}>
                      <TableCell className={s.idColumn}>{product.id.substring(0, 6)}...</TableCell>
                      <TableCell>
                        <div>
                          <div className={s.productName}>
                            {product.productNames.en?.[0] || product.productNames.uk?.[0] || 'Unnamed'}
                          </div>
                          <div className={s.mobileOnlyInfo}>
                            <span>Type: {product.productTypeId}</span>
                            <span>Images: {product.productImages?.length || 0}</span>
                            <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={s.hideOnMobile}>{product.productTypeId}</TableCell>
                      <TableCell className={s.hideOnMobile}>{product.productImages?.length || 0}</TableCell>
                      <TableCell className={s.hideOnMobile}>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className={s.actionsCell}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(product)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(product)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Pagination */}
      {totalProducts > 10 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalProducts / 10)}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Box>
      )}

      {/* Product Form Modal (Create/Edit) */}
      <ProductFormModal
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
        product={selectedProduct}
        isEditMode={isEditMode}
        onSuccess={(message) => showNotification(message, 'success')}
        onError={(message) => showNotification(message, 'error')}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
