import nodemailer from 'nodemailer';

const transporterOrders = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, //ssl
  auth: {
    user: 'orders@maaltijd.co.za',
    pass: 'Lichtenburg2740!!',
  },
});

export default transporterOrders;