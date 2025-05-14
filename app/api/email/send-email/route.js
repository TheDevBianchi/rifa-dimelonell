import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, amount, date, paymentMethod, raffleName, ticketsCount, confirmationNumber, number } = body;

    const { data, error } = await resend.emails.send({
      from: "Rifa Con Jirvin <tickets@rifaconjirvin.com>",
      to: [email],
      subject: `Confirmación de Compra - ${raffleName}`,
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Arial', sans-serif; background-color: #ffffff; color: #333333; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <!-- Logo -->
    <!-- <div style="text-align: center; padding: 20px 0;">
        <img src="cid:logo.png" alt="Logo" style="max-width: 150px; height: auto;">
    </div> -->
    <div style="background: linear-gradient(135deg, #4caf50, #81c784); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 26px;">🎉 ¡Pago Verificado! 🎉</h1>
        <p style="margin: 5px 0 0;">Gracias por confiar en nosotros</p>
    </div>
    <div style="padding: 20px; background-color: #f7f7f7; border: 1px solid #dddddd; border-radius: 0 0 10px 10px;">
        <p style="margin: 0; font-size: 16px; line-height: 1.5;">Hola <strong>${name}</strong>,</p>
        <p style="margin: 10px 0 20px; font-size: 16px; line-height: 1.5;">Estamos emocionados de confirmar tu pago de <strong>${amount}$</strong> realizado el <strong>${date}</strong> mediante <strong>${paymentMethod}</strong>. ¡Te has unido exitosamente a la rifa <strong>{{raffleName}}</strong>!</p>
        <div style="background-color: #ffffff; border: 1px dashed #81c784; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #4caf50; margin-top: 0; font-size: 18px;">Detalles del Pago</h2>
            <p style="margin: 5px 0; font-size: 15px;"><strong># Tickets:</strong> ${ticketsCount}</p>
            <p style="margin: 5px 0; font-size: 15px;"><strong>Total:</strong> ${amount}$</p>
            <p style="margin: 5px 0; font-size: 15px;"><strong>Fecha:</strong> ${date}</p>
            <p style="margin: 5px 0; font-size: 15px;"><strong>Método de Pago:</strong> ${paymentMethod}</p>
            <p style="margin: 5px 0; font-size: 15px;"><strong># Confirmación:</strong> ${confirmationNumber}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <h2 style="color: #4caf50; font-size: 18px; margin-bottom: 15px;">🔢 Tus Números</h2>
            <span style="display: inline-block; background-color: #4caf50; color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; margin: 5px;">${number}</span>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #666666; text-align: center;">No olvides estar atento a los resultados. ¡Buena suerte!</p>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; border-top: 1px solid #eeeeee; border-radius: 0 0 10px 10px;">
        <p style="margin: 0;">Saludos cordiales,<br><strong>El equipo de Rifa Con Jirvin</strong></p>
        <p style="margin: 10px 0 0; font-size: 13px;">📧 rifaconjirvin@gmail.com | ☎️ 0424-8719024 </p>
        <p style="margin: 10px 0 0; font-size: 12px; color: #999;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
    </div>
</div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in sendEmail:", error);
    return NextResponse.json(
      { success: false, error: "Ocurrió un error al enviar el correo" },
      { status: 500 }
    );
  }
} 