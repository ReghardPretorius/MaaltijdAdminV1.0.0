import fetch from 'node-fetch';
import https from 'https';
import querystring from 'querystring';
//const https = require('https');
//const querystring = require('querystring');

export const getAccessToken = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    merchantId: process.env.MERCHANT_ID,
  });

  const response = await fetch(process.env.AUTHENTICATION_ENDPOINT, {
    method: 'POST',
    headers,
    body,
  });


  const data = await response.json();
  // console.log("token:");
  // console.log(data.access_token);
  return data.access_token;
};

export const getCheckoutId = async (bearerToken, allowlistedDomain, checkoutEndpoint, amount, givenName, surname, mobile , email, merchantCustomerId, street1, city, country ,state, postcode , merchantInvoiceId) => {
  //console.log(bearerToken);
  //console.log('checkout id');
  const headers = {
    'Origin': allowlistedDomain,
    'Referer': allowlistedDomain,
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    authentication: {
      entityId: process.env.ENTITY_ID,
    },
    // amount: 100,
    // currency: 'ZAR',
    // shopperResultUrl: 'https://maaltijd.co.za',
    merchantTransactionId: merchantInvoiceId,
    // nonce: (Math.random() * 100000).toString(),
    amount: amount,
    currency: 'ZAR',
    //forceDefaultMethod: 'false',
    customer: {
      givenName: givenName,
      surname: surname,
      mobile: mobile,
      email: email,
      merchantCustomerId: merchantCustomerId
    },
    billing: {
      street1: street1,
      city: city,
      country: country,
      state: state,
      postcode: postcode
    },
    shipping: {
      street1: street1,
      city: city,
      postcode: postcode,
      country: country,
      state: state
    },
    nonce: (Math.random() * 100000).toString(),
    shopperResultUrl: 'https://maaltijd.co.za/postpayment',
    paymentType: 'DB',
    merchantInvoiceId: merchantInvoiceId,
    cancelUrl: 'https://maaltijd.co.za/postpayment'
  
  });

  const response = await fetch(`${checkoutEndpoint}/v2/checkout`, {
    method: 'POST',
    headers,
    body,
  });

  //console.log(response);
  const data = await response.json();
  //console.log(data);
  //console.log("checkoutId");
  //console.log(data.checkoutId);
  //console.log(data);
  return data.checkoutId;
};

export const getCheckoutStatus = async (merchantTransactionId, signature, bearerToken) => {
  //console.log(merchantTransactionId);

  const headers = {
    'Origin': process.env.DOMAIN,
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };

  var path = `https://testsecure.peachpayments.com/status?authentication.entityId=${process.env.ENTITY_ID}&merchantTransactionId=${merchantTransactionId}&signature=${signature}`;
  //var path = 'https://testsecure.peachpayments.com/status?authentication.entityId=8ac7a4ca8f9f6a2b018fa014509d0208&merchantTransactionId=Test1&signature=c151fd1320716c13fa4b30ae7e98cd854f8a78602ee07167829d9971d4839c03';
  //var path = 'https://testsecure.peachpayments.com/status?authentication.entityId=8ac7a4ca8f9f6a2b018fa014509d0208&merchantTransactionId=Test1&signature=c151fd1320716c13fa4b30ae7e98cd854f8a78602ee07167829d9971d4839c03';

  

  const response = await fetch(path, {
    method: 'GET',
    headers,
  });
  const data = await response.json();
  const result = data['result.code'];
  //console.log(result);
  return result;

  //return data.


//   const url = 'https://testsecure.peachpayments.com/status';
// const params = new URLSearchParams({
//     'authentication.entityId': '8ac7a4ca8f9f6a2b018fa014509d0208',
//     'merchantTransactionId': 'Test1',
//     'signature': 'c151fd1320716c13fa4b30ae7e98cd854f8a78602ee07167829d9971d4839c03'
// });

// fetch(`${url}?${params.toString()}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log('Response data:', data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });


};










// const request = async () => {
// 	//var path=`/v1/checkouts/${checkoutId}/payment`;
//   var path = `https://eu-test.oppwa.com/v3/query/${checkoutId}`
// 	path += `?entityId=${process.env.ENTITY_ID}`;
// 	const options = {
// 		port: 443,
// 		host: 'eu-test.oppwa.com',
// 		path: path,
// 		method: 'GET',
// 		headers: {
// 			'Authorization': `Bearer ${bearerToken}`,
// 		}
// 	};
// 	return new Promise((resolve, reject) => {
// 		const postRequest = https.request(options, function(res) {
// 			const buf = [];
// 			res.on('data', chunk => {
// 				buf.push(Buffer.from(chunk));
// 			});
// 			res.on('end', () => {
// 				const jsonString = Buffer.concat(buf).toString('utf8');
//         console.log(jsonString);
// 				try {
// 					resolve(JSON.parse(jsonString));
// 				} catch (error) {
// 					reject(error);
// 				}
// 			});
// 		});
// 		postRequest.on('error', reject);
// 		postRequest.end();
// 	});
// };

// request().then(console.log).catch(console.error);




// const request = require('request');

// const options = {
//   method: 'POST',
//   url: 'https://testsecure.peachpayments.com/v2/checkout',
//   headers: {
//     accept: 'application/json',
//     Referer: 'https://maaltijd.co.za',
//     'content-type': 'application/json',
//     authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjEtMDktMDYifQ.eyJlbnRpdHlJRCI6IjIzOTQ2NjVkNDI4YjQwYWU4MTlhMThiY2E5NGQxYjViIiwicGFydG5lciI6ZmFsc2UsInNpZCI6IjMzMTU4ODkxYjgyY2QxNTFjOTdjIiwibWVyY2hhbnRJZCI6IjIzOTQ2NjVkNDI4YjQwYWU4MTlhMThiY2E5NGQxYjViIiwiaWF0IjoxNzE3MzI3MzYzLCJuYmYiOjE3MTczMjczNjMsImV4cCI6MTcxNzM0MTc2MywiYXVkIjoiaHR0cHM6Ly9tMm0ucGVhY2hwYXltZW50cy5jb20iLCJpc3MiOiJodHRwczovL3NhbmRib3gtc2VydmljZXMucHBheS5pby8iLCJzdWIiOiJkZjJlOWJlOWI3YWFhMDQ5ZTIwY2Y5NmM3Mzg3ODUifQ.OHEu8gdccPMx6qV4r_bqgxGVScwUytV8XFjnXzqLwTNv9ogdjHR3BE1Th-XvsTNEv2893LSrL84FD_F1f0cWJSd5KqLrFrLVwi81PmrTF6h_93BH_qEnwP83hMW5CcwQCaGvMVy2u83I97OR3hBeYHaBlbloD-lDTa0_c8cQCAITlXR5DHoc_j6QEpob06EwY8wc5HpuCH8Ym3xwWkqCqhYHhNTzTde-gnAf7HjUrJZU3p236QKwlybpNo9mZmuaThx3SGywyrrlcqQCa6_HEiXgVadLCXKADi8RxgtcmfOxN62C0Ysqu7niiGrs4cI2qC9t4CL-t5AodTylep_n-5d4SWzpwOHHxVqm7TCvr58wyMyUndr2hL5oDMjD30OcAawbha87H4gPJy4EIvYivK8LaSS6vSURn3sZz7rrIdR7PvJO8QHkUiifYaFBCbKNbVvPT-maZDPGv0IqRssoOZan5dOC_1GQEA48ImjeszUVQi2_muG8UCFJ8VQ3p6MS1xQfi8iV0PrD1Tx4wyazNkzb_5T1rZhXp-w1CSj9OR7VNrpfEhviIpyFiXSWPa_bNycbIxHghAl20HNNXHcDiwX6fDWTcM_ZK1UP0uN66DR9AF7lVl6Myqo8L4eYwGvkh-VupiKWDlsX68sSoRKr6fHdqwf0DByZm48xcfP6--o'
//   },
//   body: {
//     currency: 'ZAR',
//     forceDefaultMethod: 'false',
//     customer: {
//       givenName: 'john',
//       surname: 'smith',
//       mobile: '0823232481',
//       email: 'reghard.pretorius',
//       merchantCustomerId: 'customrer_id'
//     },
//     billing: {
//       street1: 'street 1',
//       city: 'potchefstroom',
//       country: 'ZA',
//       state: 'North West',
//       postcode: '2531'
//     },
//     shipping: {
//       street1: 'again street',
//       city: 'Potchefstroom',
//       postcode: '2531',
//       country: 'ZA',
//       state: 'North West'
//     },
//     nonce: 'asasas',
//     shopperResultUrl: 'https://maaltijd.co.za',
//     paymentType: 'DB',
//     merchantInvoiceId: 'INV-000001',
//     cancelUrl: 'https://maaltijd.co.za/checkout/cancel'
//   },
//   json: true
// };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });
