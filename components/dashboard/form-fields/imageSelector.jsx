'use client'

import { XIcon, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/app/actions/upload'

function ImageUploadField({ field }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (files) => {
    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Convertir el archivo a base64 en el cliente
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })

        // Llamar a la Server Action con el base64
        const result = await uploadToCloudinary(base64)
        if (result.error) {
          throw new Error(result.error)
        }
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Obtener las URLs actuales (si existen)
      const currentUrls = field.value?.split('\n').filter(url => url.trim()) || []
      
      // Combinar las URLs existentes con las nuevas
      field.onChange([...currentUrls, ...uploadedUrls].join('\n'))
      
      toast.success('Imágenes subidas exitosamente')
    } catch (error) {
      console.error('Error al subir imágenes:', error)
      toast.error('Error al subir las imágenes', {
        description: error.message
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors'>
        <label className='flex flex-col items-center cursor-pointer'>
          <ImageIcon className='w-8 h-8 text-gray-400' />
          <span className='mt-2 text-sm text-gray-400'>
            {isUploading 
              ? 'Subiendo imágenes...' 
              : 'Arrastra imágenes o haz clic para seleccionar'
            }
          </span>
          <input
            type='file'
            className='hidden'
            multiple
            accept='image/*'
            disabled={isUploading}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
      </div>

      {field.value && (
        <div className='grid grid-cols-3 gap-4'>
          {field.value
            .split('\n')
            .filter(url => url.trim())
            .map((url, index) => (
              <div key={index} className='relative group'>
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className='w-full h-24 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => {
                    const urls = field.value
                      .split('\n')
                      .filter((_, i) => i !== index)
                    field.onChange(urls.join('\n'))
                  }}
                  className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <XIcon className='w-4 h-4' />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ImageUploadField
