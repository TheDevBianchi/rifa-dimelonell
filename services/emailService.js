import emailjs from '@emailjs/browser'

export const sendPurchaseConfirmation = async (purchaseData) => {
  try {
    const emailParams = {
      email: purchaseData.email,
      name: purchaseData.name,
      amount: purchaseData.amount,
      date: new Date().toLocaleDateString(),
      paymentMethod: purchaseData.paymentMethod,
      raffleName: purchaseData.raffleName,
      ticketsCount: purchaseData.selectedTickets.length,
      confirmationNumber: purchaseData.reference,
      number: purchaseData.selectedTickets.join(', ')
    }

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      emailParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    )

    return response
  } catch (error) {
    console.error('Error enviando email:', error)
    throw error
  }
} 