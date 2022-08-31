require("dotenv").config();
var googleapis = require('googleapis').google;
var googleauth = require('google-auth-library');

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

const getClient = () => {
  return new Promise((resolve) => {
    const client = new googleauth.JWT({
      email: process.env.GOOGLE_AUTH_EMAIL,
      key: process.env.GOOGLE_AUTH_KEY,
      scopes: ["https://www.googleapis.com/auth/drive"]
    });
    client.authorize(() => {
      resolve(client);
    });
  });
};

exports.handler = async (event) => {
  const auth = await getClient();
  const drive = googleapis.drive({ version: "v3", auth });
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: "Success",
      headers
    };
  }
  const reqBody = JSON.parse(event.body);
  return new Promise((resolve) => {
    drive.files.get(
      { fileId: reqBody.fileId, alt: "media" },
      { responseType: "stream" },
      (err, res) => {
        if (err) {
          resolve({
            statusCode: 404,
            body: "Failure",
            headers
          });
          return;
        }
        let data = "";
        res.data.on("data", (chunk) => {
          data += chunk;
        });
        res.data.on("end", () => {
          resolve({
            statusCode: 200,
            body: data,
            headers
          });
        });
      });
  });
} 