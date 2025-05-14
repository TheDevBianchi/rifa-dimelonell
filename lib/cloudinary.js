'use server'

import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dr1xgnnuq',
  api_key: '178864154367885',
  api_secret: 'jbH10NZW6autV2Ve69ezQ0Hp3CA'
});

/**
 * Sube una imagen a Cloudinary
 * @param {File} file - El archivo de imagen a subir
 * @returns {Promise<string>} - URL de la imagen subida
 */

export const uploadToCloudinary = async (file) => {
  try {
    // Convertir el archivo a base64
    const base64Data = await fileToBase64(file);
    
    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'rifas', // Carpeta en Cloudinary donde se guardarán las imágenes
      transformation: [
        { quality: 'auto' }, // Optimización automática de calidad
        { fetch_format: 'auto' } // Formato automático según el navegador
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    throw error;
  }
};

/**
 * Convierte un objeto File a base64
 * @param {File} file - El archivo a convertir
 * @returns {Promise<string>} - String en formato base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}; 