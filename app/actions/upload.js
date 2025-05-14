'use server'

import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(base64Data) {
  try {
    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'rifas',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    return { error: error.message };
  }
} 