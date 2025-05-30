'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImageToCloudinary } from '@/services/cloudinaryService';
import { styled } from '@mui/material/styles';

// Styled components
const ProfileAvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(2),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UploadOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
}));

const HiddenInput = styled('input')({
  display: 'none',
});

interface ProfileImageProps {
  currentImage?: string;
  username: string;
  onImageChange: (imageUrl: string) => void;
  size?: number;
  cloudName: string;
  uploadPreset: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  currentImage,
  username,
  onImageChange,
  size = 120,
  cloudName,
  uploadPreset,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert file to base64
      const base64 = await convertFileToBase64(file);

      // Upload to cloudinary
      const imageUrl = await uploadImageToCloudinary(
        base64,
        uploadPreset,
        cloudName
      );

      if (imageUrl) {
        onImageChange(imageUrl);
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      console.error('Profile image upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Generate initials from username
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <ProfileAvatarWrapper>
        <Avatar
          sx={{
            width: size,
            height: size,
            fontSize: size * 0.4,
            bgcolor: currentImage ? 'transparent' : 'primary.main',
          }}
          src={currentImage}
        >
          {!currentImage && getInitials(username)}
        </Avatar>

        {uploading ? (
          <UploadOverlay sx={{ opacity: 1 }}>
            <CircularProgress size={size * 0.4} color="secondary" />
          </UploadOverlay>
        ) : (
          <UploadOverlay>
            <Box display="flex">
              <IconButton
                size="small"
                color="inherit"
                sx={{ color: 'white', mr: 1 }}
                onClick={handleImageClick}
              >
                <EditIcon />
              </IconButton>

              {currentImage && (
                <IconButton
                  size="small"
                  color="inherit"
                  sx={{ color: 'white' }}
                  onClick={handleRemoveImage}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </UploadOverlay>
        )}

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </ProfileAvatarWrapper>

      <Typography variant="caption" color="textSecondary" align="center">
        Click to change profile photo
      </Typography>

      {error && (
        <Typography
          variant="caption"
          color="error"
          align="center"
          sx={{ mt: 1 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
