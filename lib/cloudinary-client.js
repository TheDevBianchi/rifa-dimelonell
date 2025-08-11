'use client';

/**
 * Sube una imagen a Cloudinary directamente desde el cliente
 * @param {File} file - El archivo de imagen a subir
 * @returns {Promise<string>} - URL de la imagen subida
 */
export const uploadToCloudinaryClient = async (file) => {
  try {
    // Crear un objeto FormData para la subida
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dimelonell'); // Debes crear este preset en tu dashboard de Cloudinary
    formData.append('cloud_name', 'dix3ofiek');
    
    // Realizar la petición a la API de Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dix3ofiek/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al subir la imagen a Cloudinary');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error.message);
    throw error;
  }
};
