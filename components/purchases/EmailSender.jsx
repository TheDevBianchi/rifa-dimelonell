'use client'

import { memo, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'

export const EmailSender = memo(({ emailData }) => {
  useEffect(() => {
    const sendEmail = async () => {
      try {
        console.log('Iniciando envío de correo...')
        console.log('Datos del correo antes de sanitizar:', emailData)

        // Verificar las variables de entorno
        if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
          throw new Error('SERVICE_ID no configurado')
        }
        if (!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
          throw new Error('TEMPLATE_ID no configurado')
        }
        if (!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
          throw new Error('PUBLIC_KEY no configurado')
        }

        // Sanitizar los datos
        const sanitizedEmailData = Object.entries(emailData).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value)
          return acc
        }, {})

        console.log('Datos sanitizados:', sanitizedEmailData)
        console.log('Configuración EmailJS:', {
          serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          hasPublicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        })

        // Intentar enviar el correo
        const response = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          sanitizedEmailData,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )

        console.log('Respuesta del servidor EmailJS:', response)
        toast.success('Correo enviado exitosamente')
      } catch (error) {
        console.error('Error detallado al enviar el correo:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          data: error.data,
          code: error.code
        })

        // Mensajes de error específicos
        let errorMessage = 'Error al enviar el correo'
        if (error.message.includes('SERVICE_ID')) {
          errorMessage = 'Error de configuración: SERVICE_ID no válido'
        } else if (error.message.includes('TEMPLATE_ID')) {
          errorMessage = 'Error de configuración: TEMPLATE_ID no válido'
        } else if (error.message.includes('PUBLIC_KEY')) {
          errorMessage = 'Error de configuración: PUBLIC_KEY no válido'
        } else if (error.message.includes('Network')) {
          errorMessage = 'Error de red al enviar el correo'
        }

        toast.error(errorMessage, {
          description: 'Por favor, contacta al administrador del sistema'
        })
      }
    }

    if (emailData) {
      sendEmail()
    } else {
      console.warn('No se recibieron datos para enviar el correo')
    }
  }, [emailData])

  return null
})

EmailSender.displayName = 'EmailSender' 