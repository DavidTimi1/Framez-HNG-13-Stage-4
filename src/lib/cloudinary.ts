
// Get Cloudinary credentials from environment variables
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Cloudinary upload endpoint
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload image to Cloudinary
 * 
 * @param imageUri - Local file URI from expo-image-picker
 * @returns Promise<string> - Cloudinary secure URL of uploaded image
 * @throws Error if upload fails
 */
export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  // Validate environment variables
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary credentials not found. Please check your .env file:\n' +
      'EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name\n' +
      'EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name'
    );
  }

  try {
    // Create form data
    const formData = new FormData();

    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append file to form data
    // @ts-ignore - FormData typing is tricky with React Native
    formData.append('file', {
      uri: imageUri,
      type: type,
      name: filename,
    });

    // Append upload preset
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Optional: Add folder organization
    formData.append('folder', 'framez-posts');

    // Optional: Add tags for better organization
    formData.append('tags', 'framez,post,mobile');

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || 'Upload failed. Please try again.'
      );
    }

    const data = await response.json();

    // Return secure HTTPS URL
    return data.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('credentials')) {
      throw error; // Re-throw credential errors as-is
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error('Failed to upload image. Please try again.');
    }
  }
};

/**
 * Get optimized image URL from Cloudinary
 * 
 * This function takes a Cloudinary URL and returns an optimized version
 * with transformations applied (resize, quality, format).
 * 
 * @param imageUrl - Full Cloudinary image URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}
): string => {
  // Default options
  const {
    width = 800,
    height = 800,
    quality = 'auto',
    format = 'auto',
  } = options;

  // Check if it's a Cloudinary URL
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl; // Return original if not Cloudinary
  }

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    'c_limit', // Don't upscale, only downscale
    `q_${quality}`,
    `f_${format}`,
  ].join(',');

  // Insert transformations into URL
  // https://res.cloudinary.com/cloud/image/upload/v123/image.jpg
  // becomes
  // https://res.cloudinary.com/cloud/image/upload/w_800,h_800,c_limit,q_auto,f_auto/v123/image.jpg
  return imageUrl.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * Delete image from Cloudinary
 * 
 * NOTE: This requires authenticated API calls and is not available with unsigned uploads.
 * For production, implement this on your backend server.
 * 
 * @param publicId - Cloudinary public ID of the image
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  throw new Error(
    'Delete operation requires authenticated API calls. ' +
    'Implement this on your backend server with Cloudinary SDK.'
  );
};

/**
 * Validate image before upload
 * 
 * @param imageUri - Local file URI
 * @returns boolean - true if valid, false otherwise
 */
export const validateImage = (imageUri: string): boolean => {
  // Check if URI exists
  if (!imageUri) {
    return false;
  }

  // Check file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasValidExtension = validExtensions.some(ext => 
    imageUri.toLowerCase().endsWith(ext)
  );

  return hasValidExtension;
};

/**
 * Get image metadata from Cloudinary URL
 * 
 * @param imageUrl - Cloudinary image URL
 * @returns Object with metadata or null
 */
export const getImageMetadata = (imageUrl: string): {
  cloudName: string;
  publicId: string;
  version: string;
  format: string;
} | null => {
  // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
  const regex = /cloudinary\.com\/([^\/]+)\/image\/upload\/v(\d+)\/(.+)\.(\w+)/;
  const match = imageUrl.match(regex);

  if (!match) {
    return null;
  }

  return {
    cloudName: match[1],
    version: match[2],
    publicId: match[3],
    format: match[4],
  };
};

// Export all functions
export default {
  uploadToCloudinary,
  getOptimizedImageUrl,
  deleteFromCloudinary,
  validateImage,
  getImageMetadata,
};