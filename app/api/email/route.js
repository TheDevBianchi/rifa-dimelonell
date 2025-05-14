import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { to, subject, purchaseData, raffle } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Jirvin Rifas <no-reply@jirvinrifas.com>',
      to: [to],
      subject: subject,
      html: `
        <h2>¡Gracias por tu compra!</h2>
        <p>Detalles de tu reserva:</p>
        <ul>
          ${!raffle.randomTickets 
            ? `<li>Tickets: ${purchaseData.selectedTickets.join(', ')}</li>`
            : `<li>Sus tickets serán enviados próximamente</li>`
          }
          <li>Total: $${(purchaseData.selectedTickets.length * raffle.price).toFixed(2)} USD</li>
          <li>Método de pago: ${purchaseData.paymentMethod}</li>
          <li>Referencia: ${purchaseData.paymentReference}</li>
        </ul>
        <p>Rifa: ${raffle.title}</p>
      `,
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
