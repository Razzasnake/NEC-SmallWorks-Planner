const https = require("https");

const STRIPE_PRIVATE_KEY ="***REMOVED***"; // "***REMOVED***"
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
        resolve({
          statusCode: 200,
          body: (user && user.subscriptions.data.length && user.subscriptions.data[0].status === "active") ? "1" : "0",
          headers
        });
      });
    });
  });
}