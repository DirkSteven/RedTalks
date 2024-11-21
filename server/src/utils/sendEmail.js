import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export default async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE), // true for SSL, false for non-SSL
      auth: {
        user: process.env.USER,
        pass: process.env.PASS.trim(),
      },
    });

	// const transporter = nodemailer.createTransport({
	// 	host: 'smtp.gmail.com',
	// 	service: 'gmail',
	// 	port: 587,
	// 	secure: false,
	// 	auth: {
	// 	  user: 'redtalkstest@gmail.com ',
	// 	  pass: 'ckjelpkkqowpdfyz', // Hardcode it for now
	// 	},
	//   });

    // Sending the email
    const info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
	  html: html,
    });

    console.log('Email sent successfully:', info.messageId);
    return info; // Return the email info if needed elsewhere
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Propagate error to the caller
  }
};
