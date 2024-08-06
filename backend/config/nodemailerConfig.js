// config/nodemailerConfig.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, //ssl
  auth: {
    user: 'no-reply@maaltijd.co.za',
    pass: 'Lichtenburg2740!!',
  },
});

export default transporter;

