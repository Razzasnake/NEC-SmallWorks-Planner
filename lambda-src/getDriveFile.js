const https = require("https");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

const get = (url, resolve) => {
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36" } }, (res) => {
    if (res.statusCode === 303) {
      return get(res.headers.location, resolve);
    }
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      resolve(data);
    });
  });
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
    get(reqBody.webContentLink, (data) => {
      resolve({
        statusCode: 200,
        body: data,
        headers
      });
    });
  });
}