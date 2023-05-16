const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Determine the absolute path to jobDataWithCoordinates.json
const filePath = path.join(__dirname, 'jobDataWithCoordinates.json');

console.log('Watching file:', filePath);

// Watch the JSON file for changes
fs.watch(filePath, (eventType, filename) => {
  if (eventType === 'change') {
    console.log('Detected change in', filename);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log('Sending "fileChanged" message to client');
        client.send('fileChanged');
      }
    });
  }
});

server.listen(8081, () => {
  console.log('WebSocket server listening on port 8081');
});
