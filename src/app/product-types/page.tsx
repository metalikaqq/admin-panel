'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// API base URL - adjust to your NestJS server address
const API_BASE_URL = 'http://localhost:3000';

// Define ProductType interface
interface ProductType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API Response interface
interface ApiResponse<T> {
  data: T;
  error?: string;
}

const ProductTypesPage: React.FC = () => {
  // State for product types
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // State for dialogs
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // State for form inputs
  const [newProductTypeName, setNewProductTypeName] = useState('');
  const [currentProductType, setCurrentProductType] =
    useState<ProductType | null>(null);

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fetch product types on component mount
  // Function to show notifications
  const showNotification = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setNotification({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  // Function to fetch product types from API
  const fetchProductTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse<ProductType[]>>(
        `${API_BASE_URL}/product-types`
      );

      console.log('API Response:', response.data);

      // Ensure we always have an array with valid product types
      const data = response.data?.data;
      if (Array.isArray(data)) {
        // Filter out any invalid product types (missing id or name)
        const validProductTypes = data.filter((pt) => pt && pt.id && pt.name);

        if (validProductTypes.length !== data.length) {
          console.warn(
            'Some product types were filtered out due to missing required fields'
          );
        }

        setProductTypes(validProductTypes);
      } else {
        console.error('API response data is not an array:', data);
        setProductTypes([]);
        showNotification('Invalid response format from server', 'error');
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
      setProductTypes([]); // Ensure productTypes is always an array
      showNotification('Failed to load product types', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  // Function to handle adding a new product type
  const handleAddProductType = async () => {
    if (!newProductTypeName.trim()) return;

    try {
      const response = await axios.post<ApiResponse<ProductType>>(
        `${API_BASE_URL}/product-types`,
        {
          name: newProductTypeName.trim(),
        }
      );

      console.log('Add product type response:', response.data);

      // Add the new product type to state
      const newProductType = response.data?.data;
      if (newProductType && newProductType.id && newProductType.name) {
        setProductTypes((prev) => [...prev, newProductType]);
        setNewProductTypeName('');
        setOpenAddDialog(false);
        showNotification('Product type added successfully', 'success');
      } else {
        console.error('Invalid product type data:', newProductType);
        showNotification('Invalid response from server', 'error');
      }
    } catch (error) {
      console.error('Error adding product type:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || 'Failed to add product type';
        showNotification(errorMessage, 'error');
      } else {
        showNotification('Failed to add product type', 'error');
      }
    }
  };

  // Function to handle editing a product type
  const handleEditProductType = async () => {
    if (!currentProductType || !currentProductType.name.trim()) return;

    try {
      const response = await axios.put<ApiResponse<ProductType>>(
        `${API_BASE_URL}/product-types/${currentProductType.id}`,
        { name: currentProductType.name.trim() }
      );

      // Update the product type in state
      if (response.data?.data) {
        setProductTypes((prev) =>
          prev.map((pt) =>
            pt.id === currentProductType.id ? response.data.data : pt
          )
        );

        setOpenEditDialog(false);
        setCurrentProductType(null);
        showNotification('Product type updated successfully', 'success');
      } else {
        showNotification('Invalid response from server', 'error');
      }
    } catch (error) {
      console.error('Error updating product type:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || 'Failed to update product type';
        showNotification(errorMessage, 'error');
      } else {
        showNotification('Failed to update product type', 'error');
      }
    }
  };

  // Function to handle deleting a product type
  const handleDeleteProductType = async () => {
    if (!currentProductType) return;

    try {
      await axios.delete<ApiResponse<ProductType>>(
        `${API_BASE_URL}/product-types/${currentProductType.id}`
      );

      // Remove the product type from state
      setProductTypes((prev) =>
        prev.filter((pt) => pt.id !== currentProductType.id)
      );
      setOpenDeleteDialog(false);
      setCurrentProductType(null);
      showNotification('Product type deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting product type:', error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || 'Failed to delete product type';
        showNotification(errorMessage, 'error');
      } else {
        showNotification('Failed to delete product type', 'error');
      }
      setOpenDeleteDialog(false);
    }
  };

  // Function to open the edit dialog
  const openEdit = (productType: ProductType) => {
    // Ensure the product type has all required fields
    if (!productType || !productType.id || !productType.name) {
      console.error('Attempted to edit invalid product type:', productType);
      showNotification('Cannot edit this item: missing required data', 'error');
      return;
    }

    setCurrentProductType({ ...productType });
    setOpenEditDialog(true);
  };

  // Function to open the delete dialog
  const openDelete = (productType: ProductType) => {
    setCurrentProductType(productType);
    setOpenDeleteDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Product Types
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Product Type
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!Array.isArray(productTypes) || productTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No product types found. Add your first one!
                  </TableCell>
                </TableRow>
              ) : (
                productTypes.map((productType) => (
                  <TableRow key={productType?.id || `row-${Math.random()}`}>
                    <TableCell>
                      {productType?.id
                        ? productType.id.substring(0, 8) + '...'
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{productType?.name || 'Unnamed Type'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => openEdit(productType)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDelete(productType)}
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
      )}

      {/* Add Product Type Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Product Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for the new product type.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Product Type Name"
            type="text"
            fullWidth
            value={newProductTypeName}
            onChange={(e) => setNewProductTypeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddProductType}
            color="primary"
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Type Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Product Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the name for this product type.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Product Type Name"
            type="text"
            fullWidth
            value={currentProductType?.name || ''}
            onChange={(e) =>
              setCurrentProductType(
                currentProductType
                  ? { ...currentProductType, name: e.target.value }
                  : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEditProductType}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Product Type Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product type &quot;
            {currentProductType?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProductType}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductTypesPage;
