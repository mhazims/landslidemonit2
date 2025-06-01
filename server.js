// server.js
const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Konfigurasi
const PORT = process.env.PORT || 3000;
const MQTT_BROKER = 'wss://c39f18fd98e346cbb96d4081af10c3f5.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_USERNAME = 'oktatata';
const MQTT_PASSWORD = 'jyHbAUSS37_hpgR';
const MQTT_TOPIC = 'test/topic';

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

// Rute utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard1.html'));
});

// Koneksi ke broker MQTT
const mqttClient = mqtt.connect(MQTT_BROKER, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  rejectUnauthorized: false,
});

mqttClient.on('connect', () => {
  console.log('Terhubung ke broker MQTT HiveMQ Cloud');
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (!err) {
      console.log(`Berlangganan ke topik: ${MQTT_TOPIC}`);
    } else {
      console.error('Kesalahan saat berlangganan:', err);
    }
  });
});

mqttClient.on('error', (err) => {
  console.error('Kesalahan MQTT:', err);
});

mqttClient.on('message', (topic, message) => {
  const msg = message.toString();
  console.log(`Pesan diterima pada topik ${topic}: ${msg}`);

  // Kirim pesan ke semua klien yang terhubung melalui Socket.IO
  io.emit('mqtt-message', { topic, message: msg });
});

// Jalankan server
server.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
