// controllers/emailController.js
import asyncHandler from 'express-async-handler';

import transporterOrders from '../config/nodemailerConfigOrders.js';


const sendOrderEmail = asyncHandler(async (req, res) => {
  //const { email } = req.body;
  //const OTP = Math.floor(1000 + Math.random() * 9000);
  ////otpMap[email] = OTP;
  const { email, merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails,  deliveryFee, orderID  } = req.body;

  const subtotal = deliveryFee > 0 ? totalPrice - deliveryFee : totalPrice;

  let orderItemsHtml = '';
  orderDetails.forEach(item => {
    orderItemsHtml += `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${item.itemPicture}" alt="${item.itemName}" style="width: 50px; height: 50px; margin-right: 20px;"/>
        <div>
          <p style="margin: 0; font-weight: bold; text-align: left; color: #000000">${item.itemName}</p>
          <p style="margin: 0; text-align: left; color: #000000">${item.quantity}x</p>
          <p style="margin: 0; text-align: left; color: #000000">Total Price: R${item.totalPrice}</p>
        </div>
      </div>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 4px;">
    `;
  });

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: `Maaltijd Order Confirmed | ${merchantTransactionId}`,
    html: `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Order Confirmation</title>
        <link href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style="margin: 0; font-family: 'Sen', sans-serif; background: #ffffff; font-size: 14px;">
        <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png); background-repeat: repeat; background-size: cover; overflow: hidden; background-position: top center; height: auto; font-size: 15px; color: #434343;">
          <main>
            <div style="margin: 0; padding: 50px 30px 50px; background: #ffffff; border-radius: 30px; border-color: #daa927; border-style:solid; border-width:medium; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f1f1f;">Order Confirmation</h1>
              <p style="margin: 0; margin-top: 10px; font-weight: 700; letter-spacing: 0.56px; color: #1f1f1f;">Thank you for your order!</p>
              <p style="margin: 0; margin-top: 10px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Order Number:</strong></p>
<p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #1F305E; text-align: left;">
  <a href="https://maaltijd.co.za/user/order/${orderID}" style="color: #1F305E; text-decoration: underline;">${merchantTransactionId}</a>
</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Estimated Delivery Date:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${deliveryDateFormatted}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Delivery Address:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${shortAddress}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Quantity:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${totalQuantity}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Price:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">R ${totalPrice}</p>
              <hr style="border: 0; border-top: 2px solid #e0e0e0; margin-top: 20px;">
              <div style="margin-top: 20px;">
                ${orderItemsHtml}
              </div>
                <div style="margin-top: 20px; text-align: left;">
                <p style="margin: 0; font-weight: bold; color: #000000"">Subtotal: R ${subtotal}</p>
                <p style="margin: 0; color: #000000"">Delivery: R ${deliveryFee}</p>
                <p style="margin: 0; font-weight: bold; color: #000000"">Total: R ${totalPrice}</p>
              </div>
              <p style="margin-top: 20px;color: #000000"">Need help? Ask at <a style="color: #499fb6;" href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a></p>
            </div>
          </main>
        </div>
      </body>
    </html>`
  };

  try {
    await transporterOrders.sendMail(mailOptions);
    //res.status(200).send('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    //console.error(error);
    //res.status(500).send('Error sending OTP');
    res.status(500).json({ message: 'Error sending OTP' });
  }


});

const sendAdminOrderEmail = asyncHandler(async (req, res) => {
  //const { email } = req.body;
  //const OTP = Math.floor(1000 + Math.random() * 9000);
  ////otpMap[email] = OTP;
  const { merchantTransactionId, status, orderDateFormatted, deliveryDateFormatted, freeDelivery, totalPrice, totalQuantity, shortAddress, orderDetails, deliveryFee , orderID, name, surname, deliveryAddress, cellNumber  } = req.body;

  const subtotal = deliveryFee > 0 ? totalPrice - deliveryFee : totalPrice;

  let orderItemsHtml = '';
  orderDetails.forEach(item => {
    orderItemsHtml += `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${item.itemPicture}" alt="${item.itemName}" style="width: 50px; height: 50px; margin-right: 20px;"/>
        <div>
          <p style="margin: 0; font-weight: bold; text-align: left; color: #000000">${item.itemName}</p>
          <p style="margin: 0; text-align: left; color: #000000">${item.quantity}x</p>
          <p style="margin: 0; text-align: left; color: #000000">Total Price: R${item.totalPrice}</p>
        </div>
      </div>
      <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 4px;">
    `;
  });

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: 'ordersmaaltijd@gmail.com',
    subject: `Maaltijd Order Confirmed | ${merchantTransactionId}`,
    html: `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Order Confirmation</title>
        <link href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style="margin: 0; font-family: 'Sen', sans-serif; background: #ffffff; font-size: 14px;">
        <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://maaltjidassets.s3.af-south-1.amazonaws.com/Background.png); background-repeat: repeat; background-size: cover; overflow: hidden; background-position: top center; height: auto; font-size: 15px; color: #434343;">
          <main>
            <div style="margin: 0; padding: 50px 30px 50px; background: #ffffff; border-radius: 30px; border-color: #daa927; border-style:solid; border-width:medium; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f1f1f;">Order Confirmation</h1>
              
              <p style="margin: 0; margin-top: 10px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Order Number:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${merchantTransactionId}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Name:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${name} ${surname}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Cellphone Number:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${cellNumber}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Estimated Delivery Date:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${deliveryDateFormatted}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Full Delivery Address::</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${deliveryAddress}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Delivery Address:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${shortAddress}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Quantity:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">${totalQuantity}</p>
              <p style="margin: 0; margin-top: 5px; font-weight: 400; color: #8c8c8c; text-align: left;"><strong>Total Price:</strong></p>
              <p style="margin: 0; margin-top: 5px; margin-bottom: 2px; font-weight: 400; color: #8c8c8c; text-align: left;">R ${totalPrice}</p>
              <hr style="border: 0; border-top: 2px solid #e0e0e0; margin-top: 20px;">
              <div style="margin-top: 20px;">
                ${orderItemsHtml}
              </div>
                <div style="margin-top: 20px; text-align: left;">
                <p style="margin: 0; font-weight: bold;">Subtotal: R ${subtotal}</p>
                <p style="margin: 0;">Delivery: R ${deliveryFee}</p>
                <p style="margin: 0; font-weight: bold;">Total: R ${totalPrice}</p>
              </div>
              <p style="margin-top: 20px;">Need help? Ask at <a style="color: #499fb6;" href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a></p>
            </div>
          </main>
        </div>
      </body>
    </html>`
  };

  try {
    await transporterOrders.sendMail(mailOptions);
    //res.status(200).send('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    //console.error(error);
    //res.status(500).send('Error sending OTP');
    res.status(500).json({ message: 'Error sending OTP' });
  }


});

const sendGatheringEmail = asyncHandler(async (req, res) => {
 
  const { merchantTransactionId, email, name , surname, orderID  } = req.body;

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: `Gathering Fresh Ingredients | Maaltijd Order Update | ${merchantTransactionId}`,
    html: `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
    </style>
  </head>
  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#000000;">Order Progress</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=oyZj0BBLit4P&format=png&color=4CAF50" width="30px" alt="Order Placed" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Order Placed
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=WKZGMcAHQCli&format=png&color=4CAF50" width="30px" alt="Gathering Fresh Ingredients" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Gathering Ingredients
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=lNpHTuihdfPX&format=png&color=000000" width="30px" alt="Cooking Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc; ">
                                Cooking Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=MxI9CqjjAdUN&format=png&color=000000" width="30px" alt="Refrigerating Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Refrigerating Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=4phome2o6vBp&format=png&color=000000" width="30px" alt="Out for Delivery" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc; ">
                                Out for Delivery
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=gQCfX8HpbDTV&format=png&color=000000" width="30px" alt="Delivered" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Delivered
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Click <a href="https://maaltijd.co.za/user/order/${orderID}" style="color:#daa927  ;text-decoration:none;">here</a>  to view order details
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Contact us: 
                            <p>Email: <a href="mailto:info@maaltijd.co.za" style="color:#daa927 ;text-decoration:none;">info@maaltijd.co.za</a> </p>
                            <p>Cell: <a href="tel:0710719076" style="color:#daa927 ;text-decoration:none;">071 071 9076</a></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            <a href="https://www.instagram.com/maaltijd_" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" width="50px" alt="Instagram" />
                            </a>
                            <a href="https://wa.me/+27710719076" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width="50px" alt="WhatsApp" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>

  `
};

try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'Gathering Fresh Ingredients Update sent successfully' });
} catch (error) {
    res.status(500).json({ message: 'Gathering Fresh Ingredients Update sent unsuccessfully' });
}





});

const sendCookingEmail = asyncHandler(async (req, res) => {

  const { merchantTransactionId, email, name , surname, orderID  } = req.body;

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: ` Cooking Meals | Maaltijd Order Update | ${merchantTransactionId}`,
    html: `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
    </style>
  </head>
  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#000000;">Order Progress</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=oyZj0BBLit4P&format=png&color=4CAF50" width="30px" alt="Order Placed" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Order Placed
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=WKZGMcAHQCli&format=png&color=4CAF50" width="30px" alt="Gathering Fresh Ingredients" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Gathering Ingredients
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=lNpHTuihdfPX&format=png&color=4CAF50" width="30px" alt="Cooking Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Cooking Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=MxI9CqjjAdUN&format=png&color=000000" width="30px" alt="Refrigerating Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Refrigerating Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=4phome2o6vBp&format=png&color=000000" width="30px" alt="Out for Delivery" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Out for Delivery
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=gQCfX8HpbDTV&format=png&color=000000" width="30px" alt="Delivered" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Delivered
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Click <a href="https://maaltijd.co.za/user/order/${orderID}" style="color:#daa927  ;text-decoration:none;">here</a>  to view order details
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Contact us: 
                            <p>Email: <a href="mailto:info@maaltijd.co.za" style="color:#daa927 ;text-decoration:none;">info@maaltijd.co.za</a> </p>
                            <p>Cell: <a href="tel:0710719076" style="color:#daa927 ;text-decoration:none;">071 071 9076</a></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            <a href="https://www.instagram.com/maaltijd_" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" width="50px" alt="Instagram" />
                            </a>
                            <a href="https://wa.me/+27710719076" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width="50px" alt="WhatsApp" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>

  `
};

try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'Cooking Meals Update sent successfully' });
} catch (error) {
    res.status(500).json({ message: 'Cooking Meals Update sent unsuccessfully' });
}





});

const sendRefrigeratingEmail = asyncHandler(async (req, res) => {
  

  const { merchantTransactionId, email, name , surname, orderID  } = req.body;

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: ` Refrigerating Meals | Maaltijd Order Update | ${merchantTransactionId}`,
    html: `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
    </style>
  </head>
  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#000000;">Order Progress</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=oyZj0BBLit4P&format=png&color=4CAF50" width="30px" alt="Order Placed" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Order Placed
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=WKZGMcAHQCli&format=png&color=4CAF50" width="30px" alt="Gathering Fresh Ingredients" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Gathering Ingredients
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=lNpHTuihdfPX&format=png&color=4CAF50" width="30px" alt="Cooking Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Cooking Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=MxI9CqjjAdUN&format=png&color=4CAF50" width="30px" alt="Refrigerating Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Refrigerating Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=4phome2o6vBp&format=png&color=000000" width="30px" alt="Out for Delivery" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Out for Delivery
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=gQCfX8HpbDTV&format=png&color=000000" width="30px" alt="Delivered" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Delivered
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Click <a href="https://maaltijd.co.za/user/order/${orderID}" style="color:#daa927  ;text-decoration:none;">here</a>  to view order details
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Contact us: 
                            <p>Email: <a href="mailto:info@maaltijd.co.za" style="color:#daa927 ;text-decoration:none;">info@maaltijd.co.za</a> </p>
                            <p>Cell: <a href="tel:0710719076" style="color:#daa927 ;text-decoration:none;">071 071 9076</a></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            <a href="https://www.instagram.com/maaltijd_" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" width="50px" alt="Instagram" />
                            </a>
                            <a href="https://wa.me/+27710719076" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width="50px" alt="WhatsApp" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>

  `
};

try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'Refrigerating Meals Update sent successfully' });
} catch (error) {
    res.status(500).json({ message: 'Refrigerating Meals Update sent unsuccessfully' });
}




});


const sendOutfordeliveryEmail = asyncHandler(async (req, res) => {

  const { merchantTransactionId, email, name , surname, orderID  } = req.body;

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: ` Out For Delivery | Maaltijd Order Update | ${merchantTransactionId}`,
    html: `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
    </style>
  </head>
  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#000000;">Order Progress</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=oyZj0BBLit4P&format=png&color=4CAF50" width="30px" alt="Order Placed" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Order Placed
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=WKZGMcAHQCli&format=png&color=4CAF50" width="30px" alt="Gathering Fresh Ingredients" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Gathering Ingredients
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=lNpHTuihdfPX&format=png&color=4CAF50" width="30px" alt="Cooking Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Cooking Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=MxI9CqjjAdUN&format=png&color=4CAF50" width="30px" alt="Refrigerating Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Refrigerating Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=4phome2o6vBp&format=png&color=4CAF50" width="30px" alt="Out for Delivery" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Out for Delivery
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=gQCfX8HpbDTV&format=png&color=000000" width="30px" alt="Delivered" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #cccccc;">
                                Delivered
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Click <a href="https://maaltijd.co.za/user/order/${orderID}" style="color:#daa927  ;text-decoration:none;">here</a>  to view order details
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Contact us: 
                            <p>Email: <a href="mailto:info@maaltijd.co.za" style="color:#daa927 ;text-decoration:none;">info@maaltijd.co.za</a> </p>
                            <p>Cell: <a href="tel:0710719076" style="color:#daa927 ;text-decoration:none;">071 071 9076</a></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            <a href="https://www.instagram.com/maaltijd_" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" width="50px" alt="Instagram" />
                            </a>
                            <a href="https://wa.me/+27710719076" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width="50px" alt="WhatsApp" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>

  `
};

try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'Out For Delivery Update sent successfully' });
} catch (error) {
    res.status(500).json({ message: 'Out For Delivery Update sent unsuccessfully' });
}




});

const sendDeliveredEmail = asyncHandler(async (req, res) => {

  const { merchantTransactionId, email, name , surname, orderID  } = req.body;

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: ` Delivered | Maaltijd Order Update | ${merchantTransactionId}`,
    html: `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
    </style>
  </head>
  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#000000;">Order Progress</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=oyZj0BBLit4P&format=png&color=4CAF50" width="30px" alt="Order Placed" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Order Placed
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=WKZGMcAHQCli&format=png&color=4CAF50" width="30px" alt="Gathering Fresh Ingredients" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Gathering Ingredients
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=lNpHTuihdfPX&format=png&color=4CAF50" width="30px" alt="Cooking Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Cooking Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=MxI9CqjjAdUN&format=png&color=4CAF50" width="30px" alt="Refrigerating Meals" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Refrigerating Meals
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=4phome2o6vBp&format=png&color=4CAF50" width="30px" alt="Out for Delivery" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Out for Delivery
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 20px;">
                                <img src="https://img.icons8.com/?size=100&id=gQCfX8HpbDTV&format=png&color=4CAF50" width="30px" alt="Delivered" />
                              </td>
                              <td style="padding: 10px 20px; border-left: 9px solid #4CAF50; background-color: #e6ffe6;">
                                Delivered
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Click <a href="https://maaltijd.co.za/user/order/${orderID}" style="color:#daa927  ;text-decoration:none;">here</a>  to view order details
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Contact us: 
                            <p>Email: <a href="mailto:info@maaltijd.co.za" style="color:#daa927 ;text-decoration:none;">info@maaltijd.co.za</a> </p>
                            <p>Cell: <a href="tel:0710719076" style="color:#daa927 ;text-decoration:none;">071 071 9076</a></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            <a href="https://www.instagram.com/maaltijd_" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" width="50px" alt="Instagram" />
                            </a>
                            <a href="https://wa.me/+27710719076" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width="50px" alt="WhatsApp" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>

  `
};

try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'Delivered Update sent successfully' });
} catch (error) {
    res.status(500).json({ message: 'Delivered Update sent unsuccessfully' });
}




});


const sendRescheduleEmail = asyncHandler(async (req, res) => {

  const { merchantTransactionId, email, name , surname, orderID , selectedDateFormatted } = req.body;

  const mailOptions = {
    from: 'orders@maaltijd.co.za',
    to: email,
    subject: `Rescheduled | Maaltijd Order Update | ${merchantTransactionId}`,
    html: `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
      <!--<![endif]-->

    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
    </style>
  </head>
  <body style="word-spacing:normal;">
    <div style="">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;line-height:1;text-align:center;color:#000000;">Order Update</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:left;color:#000000;">
                            Hi ${name},
                            <br /><br />
                            We just want to inform you that your order <strong>${merchantTransactionId}</strong> has been rescheduled. The new delivery date is <strong>${selectedDateFormatted}</strong>.
                            <br /><br />
                            Click <a href="https://maaltijd.co.za/user/order/${orderID}" style="color:#daa927  ;text-decoration:none;">here</a> to view your order details.
                            <br /><br />
                            May you have a very <em>lekker</em>  day, champ!
                            <br /><br />
                            Best regards,
                            <br />
                            The Maaltijd Team
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <p style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:100%;"></p>
                          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #daa927 ;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            Contact us: 
                            <p>Email: <a href="mailto:info@maaltijd.co.za" style="color:#daa927 ;text-decoration:none;">info@maaltijd.co.za</a> </p>
                            <p>Cell: <a href="tel:0710719076" style="color:#daa927 ;text-decoration:none;">071 071 9076</a></p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#000000;">
                            <a href="https://www.instagram.com/maaltijd_" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" width="50px" alt="Instagram" />
                            </a>
                            <a href="https://wa.me/+27710719076" style="color:#4CAF50;text-decoration:none;">
                              <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width="50px" alt="WhatsApp" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>
  `
};

try {
    await transporterOrders.sendMail(mailOptions);
    res.status(200).json({ message: 'Reschedule Update sent successfully' });
} catch (error) {
    res.status(500).json({ message: 'Reschedule Update sent unsuccessfully' });
}




});


export { sendOrderEmail, sendAdminOrderEmail, sendGatheringEmail, sendCookingEmail, sendRefrigeratingEmail, sendOutfordeliveryEmail, sendDeliveredEmail , sendRescheduleEmail };
