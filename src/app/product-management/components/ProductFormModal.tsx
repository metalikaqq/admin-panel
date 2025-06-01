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
  Tooltip,
} from '@mui/material';
import RichTextEditor from './RichTextEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import s from './ProductFormModal.module.scss';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  ProductModel,
  ProductType,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/models/ProductModel';
import { productService } from '@/services/productManagementService';
import { uploadImageToCloudinary } from '@/services/cloudinaryService';

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
  }, []); // Set form values when editing a product
  useEffect(() => {
    if (product && isEditMode) {
      // Set product name from the name field or first item in array for each language
      setName({
        uk: product.productNames.uk?.[0] || '',
        en: product.productNames.en?.[0] || '',
      });

      // Set description from htmlContent
      const ukHtml = product.htmlContent?.uk || '';
      const enHtml = product.htmlContent?.en || '';

      setDescription({
        uk: ukHtml,
        en: enHtml,
      });

      setProductTypeId(product.productTypeId || '');

      // Extract image URLs from the images array (new structure)
      const imageUrls = product.images?.map((img) => img.imageUrl) || [];
      setImages(imageUrls);
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

  // Handle rich text editor changes
  const handleDescriptionChange = (value: string, language: 'uk' | 'en') => {
    setDescription((prev) => ({ ...prev, [language]: value }));

    // Clear errors if any
    if (
      (language === 'uk' && errors.descriptionUk) ||
      (language === 'en' && errors.descriptionEn)
    ) {
      setErrors({
        ...errors,
        descriptionUk: language === 'uk' ? '' : errors.descriptionUk,
        descriptionEn: language === 'en' ? '' : errors.descriptionEn,
      });
    }
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

  // Remove image from array and optionally from Cloudinary
  const handleRemoveImage = async (
    index: number,
    deleteFromCloudinary: boolean = true
  ) => {
    const imageUrl = images[index];

    try {
      // Remove from Cloudinary if requested
      if (deleteFromCloudinary && imageUrl) {
        setImageLoading(true);
        const response =
          await productService.deleteImageFromCloudinary(imageUrl);
        if (!response.success) {
          console.warn(
            'Failed to delete image from Cloudinary, but removing from UI'
          );
        }
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      onError('Failed to delete image from cloud storage');
    } finally {
      setImageLoading(false);
    }

    // Remove from local state regardless of Cloudinary deletion result
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Download single image
  const handleDownloadImage = (imageUrl: string, index: number) => {
    try {
      // Extract filename from URL or use a default name
      const fileName =
        imageUrl.split('/').pop() || `product-image-${index + 1}.jpg`;

      // Use FileSaver to download the image
      saveAs(imageUrl, fileName);
    } catch (error) {
      console.error('Error downloading image:', error);
      onError('Failed to download image');
    }
  };

  // Download all images as a zip file
  const handleDownloadAllImages = async () => {
    if (!images.length) {
      onError('No images to download');
      return;
    }

    try {
      const zip = new JSZip();
      const imageFolder = zip.folder('product-images');

      // Show loading indicator
      setImageLoading(true);

      // Add all images to the zip file
      const imagePromises = images.map(async (imageUrl, index) => {
        try {
          const response = await fetch(imageUrl);
          if (!response.ok)
            throw new Error(`Failed to fetch image ${index + 1}`);

          const blob = await response.blob();
          const fileName =
            imageUrl.split('/').pop() || `product-image-${index + 1}.jpg`;
          imageFolder?.file(fileName, blob);
          return true;
        } catch (error) {
          console.error(`Error adding image ${index + 1} to zip:`, error);
          return false;
        }
      });

      await Promise.all(imagePromises);

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Create a product name for the zip file
      const productName = name.en || name.uk || 'product';
      const safeName = productName.replace(/[^a-z0-9]/gi, '-').toLowerCase();

      // Download the zip file
      saveAs(zipBlob, `${safeName}-images.zip`);
    } catch (error) {
      console.error('Error creating zip file:', error);
      onError('Failed to download images');
    } finally {
      setImageLoading(false);
    }
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
      newErrors.descriptionUk =
        'Ukrainian description is too long (max 5000 characters)';
      isValid = false;
    }

    if (description.en && description.en.length > 5000) {
      newErrors.descriptionEn =
        'English description is too long (max 5000 characters)';
      isValid = false;
    }

    // Check if the editor content is empty (contains only HTML tags without text)
    const ukTextContent = description.uk.replace(/<[^>]*>/g, '').trim();
    const enTextContent = description.en.replace(/<[^>]*>/g, '').trim();

    if (!ukTextContent && !enTextContent) {
      newErrors.descriptionEn =
        'Please add description in at least one language';
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
      // Convert editor states to HTML if not already converted
      const ukHtmlContent = description.uk;
      const enHtmlContent = description.en;

      if (isEditMode && product) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          productTypeId,
          productNames: {
            uk: name.uk ? [name.uk] : [],
            en: name.en ? [name.en] : [],
          },
          images: images,
          htmlContent: {
            uk: ukHtmlContent,
            en: enHtmlContent,
          },
        };

        const response = await productService.updateProduct(
          product.id,
          updateData
        );
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
          images: images,
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
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
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
                {errors.productTypeId && (
                  <FormHelperText>{errors.productTypeId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" className={s.sectionTitle}>
                Product Name
                {errors.name && (
                  <span className={s.errorText}>- {errors.name}</span>
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
          {' '}
          <div className={s.formSection}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" className={s.sectionTitle}>
                Product Images
                {errors.images && (
                  <span className={s.errorText}>- {errors.images}</span>
                )}
              </Typography>

              {images.length > 0 && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadAllImages}
                  disabled={imageLoading}
                >
                  Download All
                </Button>
              )}
            </Box>

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
                  <Typography
                    variant="body2"
                    component="span"
                    className={s.fileName}
                  >
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
                <Typography className={s.noImagesText}>
                  No images added yet.
                </Typography>
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
                    <div className={s.imageActions}>
                      <Tooltip title="Download image">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownloadImage(image, index)}
                          className={s.imageActionButton}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete image">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveImage(index)}
                          className={s.imageActionButton}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
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
                  <span className={s.errorText}>- {errors.descriptionEn}</span>
                )}
              </Typography>
              <RichTextEditor
                value={description.en}
                onChange={(value) => handleDescriptionChange(value, 'en')}
                placeholder="Enter English description..."
                error={!!errors.descriptionEn}
                maxLength={5000}
              />
              {errors.descriptionEn && (
                <FormHelperText error>{errors.descriptionEn}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className={s.sectionTitle}>
                Description (Ukrainian)
                {errors.descriptionUk && (
                  <span className={s.errorText}>- {errors.descriptionUk}</span>
                )}
              </Typography>
              <RichTextEditor
                value={description.uk}
                onChange={(value) => handleDescriptionChange(value, 'uk')}
                placeholder="Enter Ukrainian description..."
                error={!!errors.descriptionUk}
                maxLength={5000}
              />
              {errors.descriptionUk && (
                <FormHelperText error>{errors.descriptionUk}</FormHelperText>
              )}
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
