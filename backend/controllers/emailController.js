// controllers/emailController.js

import transporter from '../config/nodemailerConfig.js';

const otpMap = {};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  const OTP = Math.floor(1000 + Math.random() * 9000);

  otpMap[email] = OTP;

  const mailOptions = {
    from: 'no-reply@maaltijd.co.za',
    to: email,
    subject: 'Maaltijd Verification OTP',
    //text: `Your one-time PIN for email verification is: ${OTP}`,
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Sen', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png);
        background-repeat: repeat;
        background-size: cover;
        overflow: hidden;
        background-position: top center;
        height: 400px;
        font-size: 15px;
        color: #434343;
      "
    >


      <main>
        <div
          style="
            margin: 0;
            padding: 50px 30px 50px;
            background: #ffffff;
            border-radius: 30px;
            border-color: #daa927;
            border-style:solid; 
            border-width:medium;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                color: #1f1f1f;
              "
            >
              Email Verification
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 700;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Your one-time PIN for email verification is:
            </p>
                        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 0px;
            text-align: center;
            font-weight: 400;
            color: #8c8c8c;
          "
        >
          Need help? Ask at
          <a
            style="color: #499fb6;"
            >info@maaltijd.co.za</a
          >
        </p>
            <p
              style="
                margin: 0;
                margin-top: 35px;
                font-size: 40px;
                font-weight: 700;
                letter-spacing: 15px;
                color: #daa927;
              "
            >
            ${OTP}
            </p>

          </div>
          
        </div>

        
      </main>

      
    </div>
  </body>
</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    //res.status(200).send('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    //console.error(error);
    //res.status(500).send('Error sending OTP');
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (otpMap[email] && otpMap[email] == otp) {
    delete otpMap[email];
    //res.status(200).send('Email verified successfully');
    res.status(200).json({ message: 'Email verified successfully' });
  } else {
    //res.status(400).send('Invalid OTP');
    res.status(400).json({ message: 'Invalid OTP' });
  }
};

export { sendOTP, verifyOTP };
