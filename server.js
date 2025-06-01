const express = require('express');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const http = require('http');

// === Setup Express + Web Server ===
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// === Ganti sesuai dengan CloudAMQP URL kamu ===
const mqttUrl = 'amqps://tezvkbwf:u7nB-MhNP81KdhFxpKk7CTbhxbnD9-r8@collie.lmq.cloudamqp.com/tezvkbwf'; // <- ubah ini

const mqttClient = mqtt.connect(mqttUrl);

// === Ketika MQTT berhasil terkoneksi ===
mqttClient.on('connect', () => {
  console.log('✅ Terhubung ke MQTT broker');
  mqttClient.subscribe('landslide/+/+'); // <- sesuaikan topikmu
});

// === Terima pesan dari MQTT ===
mqttClient.on('message', (topic, message) => {
  console.log(`📥 MQTT message from ${topic}: ${message.toString()}`);

  // Kirim ke semua client WebSocket
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});

// === Serve file statis (HTML, CSS, JS frontend) ===
app.use(express.static(__dirname));

// === Jalankan server ===
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});