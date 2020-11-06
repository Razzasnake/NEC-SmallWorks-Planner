const fetch = require("node-fetch").default;

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
  const data = JSON.parse(event.body);
  const url = "https://api.stripe.com/v1/customers";
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${STRIPE_PRIVATE_KEY}`
    }
  }).then(async (resp) => {
    if (resp.status !== 200) {
      return {
        statusCode: resp.status,
        body: resp.statusText,
        headers
      };
    }
    const response = JSON.parse(await resp.text());
    const user = response.data.find(u => u.email === data.email);
    return {
      statusCode: 200,
      body: (user && user.subscriptions.data.length && user.subscriptions.data[0].status === "active") ? "1" : "0",
      headers
    };
  });
};