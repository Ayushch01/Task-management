import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'no-reply@legal-wires.com',
    pass: 'burdzpokkixmwrkj'
  }
});