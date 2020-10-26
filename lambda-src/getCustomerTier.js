const axios = require("axios");

const STRIPE_PRIVATE_KEY ="***REMOVED***"; // "***REMOVED***"
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: "Success",
      headers
    };
  }
  const data = JSON.parse(event.body);
  const url = "https://api.stripe.com/v1/customers";
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${STRIPE_PRIVATE_KEY}`
    }
  }).then((resp) => {
    const user = resp.data.data.find(u => u.email === data.email)
    if (user && user.subscriptions.data.length && user.subscriptions.data[0].status === "active") {
      return {
        statusCode: 200,
        body: "1",
        headers
      };
    } else {
      return {
        statusCode: 200,
        body: "0",
        headers
      };
    }
  }).catch((err) => {
    return {
      statusCode: err.response.status,
      body: err.response.statusText,
      headers
    };
  });
};