require("dotenv").config();
var googleapis = require('googleapis').google;
var googleauth = require('google-auth-library');
var { gzip } = require('zlib');

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
}

const gzipString = async (input) => {
  const buffer = Buffer.from(input);
  return new Promise((resolve, reject) => gzip(buffer, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  }));
};

const getClient = () => {
  return new Promise((resolve) => {
    const client = new googleauth.JWT({
      email: process.env.GOOGLE_AUTH_EMAIL,
      key: process.env.GOOGLE_AUTH_KEY.replaceAll('\\n', '\n'),
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
        res.data.on("end", async () => {
          resolve({
            statusCode: 200,
            body: (await gzipString(data)).toString('base64'),
            headers
          });
        });
      });
  });
}