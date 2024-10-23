import nodemailer from 'nodemailer';
import { CONTRASENA, CORREO } from '../config/configEnv.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes cambiar esto si usas otro servicio (como SendGrid o un servidor SMTP propio)
  auth: {
    user: CORREO, // Tu correo electrónico
    pass: CONTRASENA,        // Contraseña de tu cuenta o aplicación (recomendado usar contraseñas de app)
  },
});

// Función para enviar correos
 export const enviarCorreo = (destinatarios, asunto, texto) => {
  const mailOptions = {
    from: CORREO, // El correo desde donde se envía
    to: destinatarios,           // Lista de destinatarios
    subject: asunto,
    text: texto,                 // El cuerpo del correo
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};
