'use client'

export function useSendEmail() {
  const sendEmail = async ({ to, subject, purchaseData, raffle }) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          purchaseData,
          raffle
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error al enviar el correo');
    }
  };

  return { sendEmail };
}
