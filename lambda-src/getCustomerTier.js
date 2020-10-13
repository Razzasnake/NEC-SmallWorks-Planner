const axios = require("axios");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const url = "https://api.stripe.com/v1/customers";
  axios.get(url, {
    headers: {
      Authorization: "Bearer ***REMOVED***"
    }
  }).then((resp) => {
    if (resp.data.data.find(u => u.email === data.email)) {
      callback(null, {
        statusCode: 200,
        headers,
        body: "1",
      });
    } else {
      callback(null, {
        statusCode: 200,
        headers,
        body: "0",
      });
    }
  });
};