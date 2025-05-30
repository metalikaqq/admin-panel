'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Tabs,
  Tab,
  IconButton,
  FormHelperText,
  Alert,
} from '@mui/material';
import s from './ProductFormModal.module.scss';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  ProductModel,
  ProductType,
  CreateProductRequest,
  UpdateProductRequest
} from '@/models/ProductModel';
import { productService } from '@/services/productManagementService';
import { uploadImageToCloudinary, uploadMultipleImages } from '@/services/cloudinaryService';

interface ProductFormModalProps {
  open: boolean;
  onClose: (productUpdated?: boolean) => void;
  product: ProductModel | null;
  isEditMode: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProductFormModal({
  open,
  onClose,
  product,
  isEditMode,
  onSuccess,
  onError,
}: ProductFormModalProps) {
  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'product_images';
  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'datgiucvj';

  // Form state
  const [name, setName] = useState({ uk: '', en: '' });
  const [description, setDescription] = useState({ uk: '', en: '' });
  const [productTypeId, setProductTypeId] = useState('');
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    productTypeId: '',
    images: '',
    descriptionUk: '',
    descriptionEn: '',
  });

  // Fetch product types when component mounts
  useEffect(() => {
    fetchProductTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set form values when editing a product
  useEffect(() => {
    if (product && isEditMode) {
      // Set product name from the first item in array for each language
      setName({
        uk: product.productNames.uk?.[0] || '',
        en: product.productNames.en?.[0] || '',
      });

      // Set description from htmlContent
      setDescription({
        uk: product.htmlContent?.uk || '',
        en: product.htmlContent?.en || '',
      });

      setProductTypeId(product.productTypeId || '');
      setImages(product.productImages || []);
    } else {
      // Reset form for creating a new product
      resetForm();
    }
  }, [product, isEditMode]);

  // Reset form fields
  const resetForm = () => {
    setName({ uk: '', en: '' });
    setDescription({ uk: '', en: '' });
    setProductTypeId('');
    setImages([]);
    setNewImageFile(null);
    setUploadError('');
    setErrors({
      name: '',
      productTypeId: '',
      images: '',
      descriptionUk: '',
      descriptionEn: '',
    });
  };

  // Fetch product types
  const fetchProductTypes = async () => {
    setTypesLoading(true);
    try {
      const response = await productService.getAllProductTypes();
      if (response.success && response.data) {
        setProductTypes(response.data);
      } else {
        onError('Failed to load product types');
      }
    } catch (error) {
      console.error('Error loading product types:', error);
      onError('Error loading product types');
    } finally {
      setTypesLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setUploadError('');
    }
  };

  // Upload image to Cloudinary and add URL to images array
  const handleAddImage = async () => {
    if (!newImageFile) return;

    setImageLoading(true);
    setUploadError('');

    try {
      const reader = new FileReader();

      // Convert file to base64 for Cloudinary upload
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(newImageFile);
      });

      const base64Data = await base64Promise;

      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(
        base64Data,
        CLOUDINARY_UPLOAD_PRESET,
        CLOUDINARY_CLOUD_NAME
      );

      if (imageUrl) {
        setImages([...images, imageUrl]);
        setNewImageFile(null);

        // Clear the error if there was one
        if (errors.images) {
          setErrors({ ...errors, images: '' });
        }
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error uploading image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  // Remove image from array
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      name: '',
      productTypeId: '',
      images: '',
      descriptionUk: '',
      descriptionEn: '',
    };
    let isValid = true;

    // Validate name (require at least one language)
    if (!name.uk && !name.en) {
      newErrors.name = 'Product name is required in at least one language';
      isValid = false;
    } else {
      // Check name length in each language
      if (name.uk && (name.uk.length < 2 || name.uk.length > 100)) {
        newErrors.name = 'Ukrainian name must be between 2 and 100 characters';
        isValid = false;
      }

      if (name.en && (name.en.length < 2 || name.en.length > 100)) {
        newErrors.name = 'English name must be between 2 and 100 characters';
        isValid = false;
      }
    }

    // Validate product type
    if (!productTypeId) {
      newErrors.productTypeId = 'Please select a product type';
      isValid = false;
    }

    // Validate images (at least one required)
    if (images.length === 0) {
      newErrors.images = 'Please add at least one product image';
      isValid = false;
    } else if (images.length > 10) {
      newErrors.images = 'Maximum 10 images allowed per product';
      isValid = false;
    }

    // Validate content length
    if (description.uk && description.uk.length > 5000) {
      newErrors.descriptionUk = 'Ukrainian description is too long (max 5000 characters)';
      isValid = false;
    }

    if (description.en && description.en.length > 5000) {
      newErrors.descriptionEn = 'English description is too long (max 5000 characters)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditMode && product) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          productTypeId,
          productNames: {
            uk: name.uk ? [name.uk] : [],
            en: name.en ? [name.en] : [],
          },
          productImages: images,
          htmlContent: {
            uk: description.uk,
            en: description.en,
          },
        };

        const response = await productService.updateProduct(product.id, updateData);
        if (response.success) {
          onSuccess('Product updated successfully');
          onClose(true);
        } else {
          onError(response.error || 'Failed to update product');
        }
      } else {
        // Create new product
        const productData: CreateProductRequest = {
          productTypeId,
          productNames: {
            uk: name.uk ? [name.uk] : [],
            en: name.en ? [name.en] : [],
          },
          productImages: images,
          htmlContent: {
            uk: description.uk,
            en: description.en,
          },
        };

        const response = await productService.createProduct(productData);
        if (response.success) {
          onSuccess('Product created successfully');
          onClose(true);
        } else {
          onError(response.error || 'Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      onError('An error occurred while saving the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </DialogTitle>

      <DialogContent dividers className={s.modalContent}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="product form tabs"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label="Basic Info" id="product-tab-0" />
          <Tab label="Images" id="product-tab-1" />
          <Tab label="Content" id="product-tab-2" />
        </Tabs>

        {/* Basic Info Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} className={s.formRow}>
              <FormControl fullWidth error={!!errors.productTypeId}>
                <InputLabel>Product Type</InputLabel>
                <Select
                  value={productTypeId}
                  onChange={(e) => setProductTypeId(e.target.value)}
                  disabled={typesLoading}
                >
                  {typesLoading ? (
                    <MenuItem disabled value="">
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
                  ) : (
                    productTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.productTypeId && <FormHelperText>{errors.productTypeId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" className={s.sectionTitle}>
                Product Name
                {errors.name && (
                  <span className={s.errorText}>
                    - {errors.name}
                  </span>
                )}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name (English)"
                value={name.en}
                onChange={(e) => setName({ ...name, en: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name (Ukrainian)"
                value={name.uk}
                onChange={(e) => setName({ ...name, uk: e.target.value })}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Images Tab */}
        <TabPanel value={activeTab} index={1}>
          <div className={s.formSection}>
            <Typography variant="subtitle1" className={s.sectionTitle}>
              Product Images
              {errors.images && (
                <span className={s.errorText}>
                  - {errors.images}
                </span>
              )}
            </Typography>

            <div className={s.imageUploadContainer}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload-button"
                type="file"
                onChange={handleImageUpload}
                disabled={imageLoading}
              />
              <label htmlFor="image-upload-button">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                  disabled={imageLoading}
                >
                  Select Image
                </Button>
              </label>

              {newImageFile && (
                <>
                  <Typography variant="body2" component="span" className={s.fileName}>
                    {newImageFile.name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddImage}
                    disabled={imageLoading}
                  >
                    {imageLoading ? <CircularProgress size={20} /> : 'Upload'}
                  </Button>
                </>
              )}

              {uploadError && (
                <Box mt={1}>
                  <Alert severity="error">{uploadError}</Alert>
                </Box>
              )}
            </div>
          </div>

          <Grid container spacing={2}>
            {images.length === 0 ? (
              <Grid item xs={12}>
                <Typography className={s.noImagesText}>No images added yet.</Typography>
              </Grid>
            ) : (
              images.map((image, index) => (
                <Grid item key={index} xs={6} md={3}>
                  <div className={s.imageContainer}>
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className={s.productImage}
                      fill
                      objectFit="cover"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      className={s.deleteImageButton}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>

        {/* Content Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className={s.sectionTitle}>
                Description (English)
                {errors.descriptionEn && (
                  <span className={s.errorText}>
                    - {errors.descriptionEn}
                  </span>
                )}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description.en}
                onChange={(e) => setDescription({ ...description, en: e.target.value })}
                error={!!errors.descriptionEn}
                helperText={errors.descriptionEn}
              />
              <Typography variant="caption" color="textSecondary">
                {description.en ? `${description.en.length}/5000` : '0/5000'} characters
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className={s.sectionTitle}>
                Description (Ukrainian)
                {errors.descriptionUk && (
                  <span className={s.errorText}>
                    - {errors.descriptionUk}
                  </span>
                )}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description.uk}
                onChange={(e) => setDescription({ ...description, uk: e.target.value })}
                error={!!errors.descriptionUk}
                helperText={errors.descriptionUk}
              />
              <Typography variant="caption" color="textSecondary">
                {description.uk ? `${description.uk.length}/5000` : '0/5000'} characters
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isEditMode ? (
            'Update Product'
          ) : (
            'Create Product'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
