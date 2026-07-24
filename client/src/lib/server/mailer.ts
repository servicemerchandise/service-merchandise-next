import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const adminEmail = process.env.ADMIN_EMAIL || '';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

interface QuotationItem {
  product_id: string;
  name: string;
  code: string;
  quantity: number;
  observations?: string;
}

interface QuotationPayload {
  full_name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  comments?: string;
  items: QuotationItem[];
}

const itemsToHtml = (items: QuotationItem[]) => `
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <thead>
      <tr style="background:#0B2545;color:#fff">
        <th style="padding:10px;text-align:left">Código</th>
        <th style="padding:10px;text-align:left">Producto</th>
        <th style="padding:10px;text-align:center">Cantidad</th>
        <th style="padding:10px;text-align:left">Observaciones</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (it) => `
        <tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:10px;font-family:monospace">${it.code}</td>
          <td style="padding:10px">${it.name}</td>
          <td style="padding:10px;text-align:center;font-weight:bold">${it.quantity}</td>
          <td style="padding:10px;color:#6b7280">${it.observations || '—'}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
`;

const baseTemplate = (content: string) => `
<!doctype html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#0B2545">
  <div style="max-width:680px;margin:0 auto;background:#fff">
    <div style="background:linear-gradient(135deg,#0B2545,#13315C);padding:24px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:24px;letter-spacing:1px">SERVICE MERCHANDISE</h1>
      <p style="margin:4px 0 0;color:#8DA9C4;font-size:12px;letter-spacing:3px">MARKETPLACE B2B</p>
    </div>
    <div style="padding:32px">
      ${content}
    </div>
    <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
      © ${new Date().getFullYear()} Service Merchandise. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
`;

export const sendQuotationAdminEmail = async (data: QuotationPayload, quotationId: string) => {
  const content = `
    <h2 style="margin:0 0 8px">Nueva solicitud de cotización</h2>
    <p style="color:#6b7280;margin:0 0 24px">ID: <strong>${quotationId}</strong></p>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#6b7280;width:140px">Fecha</td><td><strong>${new Date().toLocaleString('es-CO')}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Cliente</td><td><strong>${data.full_name}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Empresa</td><td><strong>${data.company}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Correo</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Celular</td><td>${data.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Ciudad</td><td>${data.city}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Comentarios</td><td>${data.comments || '—'}</td></tr>
    </table>
    <h3 style="margin-top:32px">Productos solicitados</h3>
    ${itemsToHtml(data.items)}
  `;
  await transporter.sendMail({
    from: `"Service Merchandise" <${smtpUser}>`,
    to: adminEmail,
    subject: `Nueva cotización — ${data.company}`,
    html: baseTemplate(content),
  });
};

export const sendQuotationClientEmail = async (data: QuotationPayload, quotationId: string) => {
  const content = `
    <h2 style="margin:0 0 8px">¡Recibimos tu solicitud!</h2>
    <p>Hola <strong>${data.full_name}</strong>, gracias por confiar en <strong>Service Merchandise</strong>.</p>
    <p>Hemos recibido tu solicitud de cotización <strong>#${quotationId.substring(0, 8).toUpperCase()}</strong>. Nuestro equipo comercial la revisará y te contactará en menos de 24 horas hábiles con una propuesta personalizada.</p>
    <h3 style="margin-top:24px">Resumen de tu solicitud</h3>
    ${itemsToHtml(data.items)}
    <div style="margin-top:32px;padding:16px;background:#EEF4FA;border-left:4px solid #13315C;border-radius:4px">
      <strong>¿Necesitas agregar algo?</strong><br/>
      Responde este correo o contáctanos por WhatsApp. Estamos para ayudarte.
    </div>
  `;
  await transporter.sendMail({
    from: `"Service Merchandise" <${smtpUser}>`,
    to: data.email,
    subject: `Cotización recibida #${quotationId.substring(0, 8).toUpperCase()} — Service Merchandise`,
    html: baseTemplate(content),
  });
};

export const sendNewsletterWelcome = async (email: string) => {
  const content = `
    <h2>¡Bienvenido a Service Merchandise!</h2>
    <p>Gracias por suscribirte a nuestro newsletter. Recibirás novedades, productos destacados y promociones exclusivas para tu empresa.</p>
  `;
  await transporter.sendMail({
    from: `"Service Merchandise" <${smtpUser}>`,
    to: email,
    subject: 'Suscripción confirmada — Service Merchandise',
    html: baseTemplate(content),
  });
};
