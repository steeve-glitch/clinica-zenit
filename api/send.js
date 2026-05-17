const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, rut, telefono, email, especialidad, fecha } = req.body;

  if (!nombre || !rut || !telefono || !email || !especialidad || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Clínica Zenit Web" <${process.env.GMAIL_USER}>`,
    to: 'contacto@clinicazenit.cl',
    replyTo: email,
    subject: `Nueva solicitud de cita — ${nombre}`,
    html: `
      <h2>Nueva solicitud de hora</h2>
      <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:15px;">
        <tr><td><strong>Nombre</strong></td><td>${nombre}</td></tr>
        <tr><td><strong>RUT</strong></td><td>${rut}</td></tr>
        <tr><td><strong>Teléfono</strong></td><td>${telefono}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Especialidad</strong></td><td>${especialidad}</td></tr>
        <tr><td><strong>Fecha preferida</strong></td><td>${fecha}</td></tr>
      </table>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error al enviar email:', err);
    return res.status(500).json({ error: 'No se pudo enviar el mensaje' });
  }
};
