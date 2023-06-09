require("dotenv").config();
const https = require("https");

const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: "Success",
      headers
    };
  }
  const reqBody = JSON.parse(event.body);
  return new Promise((resolve) => {
    https.get("https://api.stripe.com/v1/customers", { headers: { Authorization: `Bearer ${STRIPE_PRIVATE_KEY}` } }, (resp) => {
      if (resp.statusCode !== 200) {
        return resolve({
          statusCode: resp.statusCode,
          body: resp.statusMessage,
          headers
        });
      }
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        const response = JSON.parse(data);
        const user = response.data.find(u => u.email === reqBody.email);
        const postData = `customer=${user.id}&return_url=${reqBody.return_url}`;
        const options = {
          hostname: 'api.stripe.com',
          port: 443,
          path: '/v1/billing_portal/sessions',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRIPE_PRIVATE_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
          }
        };
        const req = https.request(options, (resp2) => {
          let data2 = "";
          resp2.on("data", (chunk) => {
            data2 += chunk;
          });
          resp2.on("end", () => {
            const response2 = JSON.parse(data2);
            resolve({
              statusCode: 200,
              body: response2.url,
              headers
            });
          });
        });
        req.write(postData);
        req.end();
      });
    });
  });
}