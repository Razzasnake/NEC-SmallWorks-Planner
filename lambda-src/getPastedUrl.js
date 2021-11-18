const https = require("https");

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
    https.get(reqBody.url, (resp) => {
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
        resolve({
          statusCode: 200,
          body: data,
          headers
        });
      });
    });
  });
}