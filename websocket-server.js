// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });  // WebSocket server jalan di port 8080

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Contoh kirim data sensor secara berkala ke client
  setInterval(() => {
    const sensors = ['curahHujan', 'kelembaban', 'getaran', 'kemiringan', 'suhu'];
    const sensor = sensors[Math.floor(Math.random() * sensors.length)];
    const value = Math.floor(Math.random() * 100); // nilai random 0-100

    const data = {
      node: 'node1',
      sensor: sensor,
      value: value
    };

    ws.send(JSON.stringify(data));
  }, 2000); // kirim data tiap 2 detik

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
