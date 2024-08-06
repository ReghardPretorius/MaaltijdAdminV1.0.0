import { getAccessToken, getCheckoutId, getCheckoutStatus } from '../utils/checkoutUtils.js';
import CryptoJS from "crypto-js";


export const getCheckoutIdController = async (req, res) => {
 
  const { amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId } = req.body;
//console.log(merchantInvoiceId);
  try {
    const accessToken = await getAccessToken();
    const checkoutId = await getCheckoutId(accessToken, process.env.DOMAIN, process.env.CHECKOUT_ENDPOINT , amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId);
    const url = 'https://maaltijd.co.za/payment/' + checkoutId;

    res.status(200).json({ checkout_Id: checkoutId, entityId: process.env.ENTITY_ID, url : url, bearerToken: accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCheckoutStatusController = async (req, res) => {
 
  const { merchantTransactionId, bearerToken } = req.body;
  //console.log(req.body);

  const secret = process.env.SECRET_TOKEN;
//const message = "amount2authentication.entityId8ac7a4ca68c22c4d0168c2caab2e0025currencyZARdefaultPaymentMethodCARDmerchantTransactionIdTest1234nonceJHGJSGHDSKJHGJDHGJHpaymentTypeDBshopperResultUrlhttps://webhook.site/4e9b63bf-0d99-4d62-bd24-1d36ca866e1b";
const message = `authentication.entityId${process.env.ENTITY_ID}merchantTransactionId${merchantTransactionId}`;
//console.log(message);
const signature = CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);

//console.log(signature);

  try {
    const statusCode = await getCheckoutStatus(merchantTransactionId, signature, bearerToken);
    //const checkoutId = await getCheckoutId(accessToken, process.env.DOMAIN, process.env.CHECKOUT_ENDPOINT , amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId);
    //const url = 'https://maaltijd.co.za/payment/' + checkoutId;
//console.log(statusCode);
    res.status(200).json({ statusCode: statusCode });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};