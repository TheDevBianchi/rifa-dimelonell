import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { PlusIcon, XIcon } from 'lucide-react'
import Image from 'next/image'

export function ImagesField () {
  return (
    <div>
      <Label htmlFor='images'>Imágenes</Label>
      <Controller
        name='images'
        render={({ field }) => (
          <div>
            <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-gray-500 transition-colors'>
              <div className='space-y-1 text-center'>
                <PlusIcon className='mx-auto h-12 w-12 text-gray-400' />
                <div className='flex text-sm text-gray-400'>
                  <label
                    htmlFor='file-upload'
                    className='relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary'
                  >
                    <span>Subir imágenes</span>
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      className='sr-only'
                      multiple
                      accept='image/*'
                      onChange={async e => {
                        const files = Array.from(e.target.files || [])
                        const uploadPromises = files.map(async file => {
                          // Aquí iría la lógica de subida a tu servicio de almacenamiento
                          // Por ahora solo retornamos la URL temporal
                          return URL.createObjectURL(file)
                        })

                        const urls = await Promise.all(uploadPromises)
                        const currentUrls =
                          field.value?.split('\n').filter(url => url.trim()) ||
                          []
                        field.onChange([...currentUrls, ...urls].join('\n'))
                      }}
                    />
                  </label>
                  <p className='pl-1'>o arrastrar y soltar</p>
                </div>
                <p className='text-xs text-gray-500'>
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            </div>

            {/* Preview section */}
            {field.value && (
              <div className='mt-4 grid grid-cols-3 gap-4'>
                {field.value
                  .split('\n')
                  .filter(url => url.trim())
                  .map((url, index) => (
                    <div key={index} className='relative group'>
                      <div className='relative h-24 w-24'>
                        <Image
                          src={url}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className='object-cover rounded-md'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          const urls = field.value
                            .split('\n')
                            .filter((_, i) => i !== index)
                          field.onChange(urls.join('\n'))
                        }}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      >
                        <XIcon className='h-4 w-4' />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
