import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, amount, date, paymentMethod, raffleName, ticketsCount, number } = body;

    const { data, error } = await resend.emails.send({
      from: "Rifa Dimelonell <tickets@dimelonell.com>",
      to: [email],
      subject: `Confirmación de Compra - ${raffleName}`,
      html: `
        <div style="max-width: 600px; margin: auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; color: #333333; border-radius: 12px; box-shadow: 0 8px 25px rgba(139, 0, 0, 0.1); overflow: hidden;">
    <!-- Header con rojo vinotinto -->
    <div style="background: linear-gradient(135deg, #8B0000 0%, #a00000 100%); color: white; padding: 35px 25px; text-align: center; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');"></div>
        <div style="position: relative; z-index: 1;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🎉 ¡Pago Verificado! 🎉</h1>
            <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.95; font-weight: 300;">Gracias por confiar en Rifa Dimelonell</p>
        </div>
    </div>
    
    <!-- Contenido principal con blanco perla -->
    <div style="padding: 30px 25px; background-color: #f7f7ff;">
        <p style="margin: 0; font-size: 18px; line-height: 1.6; color: #333333;">Hola <strong style="color: #8B0000;">${name}</strong>,</p>
        <p style="margin: 15px 0 25px; font-size: 16px; line-height: 1.6; color: #333333;">Estamos emocionados de confirmar tu pago de <strong style="color: #8B0000;">${amount}$</strong> realizado el <strong>${date}</strong>. ¡Te has unido exitosamente a la rifa <strong style="color: #8B0000;">${raffleName}</strong>!</p>
        
        <!-- Detalles del pago con diseño minimalista -->
        <div style="background: #ffffff; border: 2px solid #8B0000; padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(139, 0, 0, 0.08);">
            <h2 style="color: #8B0000; margin-top: 0; font-size: 22px; font-weight: 600; border-bottom: 2px solid #f7f7ff; padding-bottom: 12px; text-align: center;">📋 Detalles del Pago</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 20px;">
                <div style="background-color: #f7f7ff; padding: 15px; border-radius: 10px; border-left: 4px solid #8B0000; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #666666; font-weight: 500;"># Tickets</p>
                    <p style="margin: 8px 0 0; font-size: 18px; color: #8B0000; font-weight: 700;">${ticketsCount}</p>
                </div>
                <div style="background-color: #f7f7ff; padding: 15px; border-radius: 10px; border-left: 4px solid #8B0000; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #666666; font-weight: 500;">Total</p>
                    <p style="margin: 8px 0 0; font-size: 18px; color: #8B0000; font-weight: 700;">${amount}$</p>
                </div>
                <div style="background-color: #f7f7ff; padding: 15px; border-radius: 10px; border-left: 4px solid #8B0000; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #666666; font-weight: 500;">Fecha</p>
                    <p style="margin: 8px 0 0; font-size: 16px; color: #333333; font-weight: 600;">${date}</p>
                </div>
                <div style="background-color: #f7f7ff; padding: 15px; border-radius: 10px; border-left: 4px solid #8B0000; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #666666; font-weight: 500;">Método de Pago</p>
                    <p style="margin: 8px 0 0; font-size: 16px; color: #333333; font-weight: 600;">${paymentMethod}</p>
                </div>
            </div>
        </div>
        
        <!-- Sección de números con rojo vinotinto -->
        <div style="text-align: center; margin-top: 30px; padding: 30px; background: #f7f7ff; border-radius: 12px; border: 2px solid #8B0000;">
            <h2 style="color: #8B0000; font-size: 24px; margin-bottom: 25px; font-weight: 600;">🔢 Tus Números de la Suerte</h2>
            <div style="display: inline-block; background: linear-gradient(135deg, #8B0000 0%, #a00000 100%); color: white; padding: 18px 30px; font-size: 20px; font-weight: bold; border-radius: 12px; margin: 5px; box-shadow: 0 6px 20px rgba(139, 0, 0, 0.3); text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${number}</div>
        </div>
        
        <p style="margin-top: 30px; font-size: 16px; color: #666666; text-align: center; font-style: italic;">No olvides estar atento a los resultados. ¡Buena suerte! 🍀</p>
    </div>
    
    <!-- Footer con rojo vinotinto -->
    <div style="background: linear-gradient(135deg, #8B0000 0%, #a00000 100%); padding: 25px; text-align: center; color: #ffffff;">
        <p style="margin: 0; font-size: 16px; font-weight: 500;">Saludos cordiales,<br><strong style="color: #f7f7ff;">El equipo de Rifa Dimelonell</strong></p>
        <div style="margin: 15px 0; padding: 15px; background-color: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
            <p style="margin: 5px 0; font-size: 14px;">📧 <a href="mailto:tickets@dimelonell.com" style="color: #f7f7ff; text-decoration: none;">tickets@dimelonell.com</a></p>
            <p style="margin: 5px 0; font-size: 14px;">☎️ <a href="tel:+573014578611" style="color: #f7f7ff; text-decoration: none;">+57 301-457-8611</a></p>
        </div>
        <p style="margin: 10px 0 0; font-size: 13px; color: #f7f7ff; opacity: 0.9;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
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