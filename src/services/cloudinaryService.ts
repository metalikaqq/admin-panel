/**
 * Cloudinary Service for handling image uploads
 */

/**
 * Uploads an image to Cloudinary
 * @param imageData Base64 encoded image data
 * @param uploadPreset Cloudinary upload preset
 * @param cloudName Cloudinary cloud name
 * @returns URL of the uploaded image or empty string on failure
 */
export const uploadImageToCloudinary = async (
  imageData: string,
  uploadPreset: string,
  cloudName: string
): Promise<string> => {
  if (!imageData) {
    console.log('[CloudinaryService] Skipping empty image');
    return '';
  }

  try {
    console.log('[CloudinaryService] Starting image upload...');

    if (!imageData.startsWith('data:')) {
      console.error(
        '[CloudinaryService] Invalid image format, not a data URL:',
        imageData.substring(0, 30) + '...'
      );
      return '';
    }

    const parts = imageData.split(';base64,');
    if (parts.length !== 2) {
      console.error('[CloudinaryService] Invalid base64 image format');
      return '';
    }

    const base64Data = parts[1];
    const mimeType = parts[0].replace('data:', '');

    const formData = new FormData();
    formData.append('file', `data:${mimeType};base64,${base64Data}`);
    formData.append('upload_preset', uploadPreset);

    console.log(
      `[CloudinaryService] Uploading to Cloudinary with preset: ${uploadPreset}`
    );

    const cloudinaryApiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(cloudinaryApiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        '[CloudinaryService] Cloudinary error response:',
        errorData
      );
      throw new Error(
        `Cloudinary responded with status ${response.status}: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    console.log(
      '[CloudinaryService] Successfully uploaded image to Cloudinary:',
      data.secure_url
    );
    return data.secure_url;
  } catch (error) {
    console.error('[CloudinaryService] Error uploading to Cloudinary:', error);
    return '';
  }
};

/**
 * Uploads multiple images to Cloudinary
 * @param images Array of base64 encoded image data
 * @param uploadPreset Cloudinary upload preset
 * @param cloudName Cloudinary cloud name
 * @returns Array of URLs for successfully uploaded images
 */
export const uploadMultipleImages = async (
  images: string[],
  uploadPreset: string,
  cloudName: string
): Promise<string[]> => {
  console.log(
    `[CloudinaryService] Attempting to upload ${images.length} images to Cloudinary`
  );

  const validImages = images.filter((img) => img);

  const cloudinaryUrls = await Promise.all(
    validImages.map((img) =>
      uploadImageToCloudinary(img, uploadPreset, cloudName)
    )
  );

  const successfulUploads = cloudinaryUrls.filter((url) => url);

  console.log(
    `[CloudinaryService] Successfully uploaded ${successfulUploads.length} of ${validImages.length} images`
  );

  if (successfulUploads.length === 0 && validImages.length > 0) {
    throw new Error(
      'Failed to upload any images. Please check your Cloudinary configuration.'
    );
  }

  return successfulUploads;
};
