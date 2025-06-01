const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// MQTT HiveMQ Cloud settings
const MQTT_BROKER = 'wss://c39f18fd98e346cbb96d4081af10c3f5.s1.eu.hivemq.cloud:8884/mqtt'; // WSS + path /mqtt
const MQTT_USERNAME = 'oktatata';
const MQTT_PASSWORD = 'jyHbAUSS37_hpgR';
const MQTT_TOPIC = 'test/topic';

// Root route
app.get('/', (req, res) => {
  res.send('Node.js app is running!');
});

// Connect MQTT client with TLS and auth
const client = mqtt.connect(MQTT_BROKER, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  rejectUnauthorized: false,  // Kalau SSL self-signed, bisa di set false, tapi kalau cloud resmi biasanya aman pakai true/default
});

client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud MQTT broker');
  client.subscribe(MQTT_TOPIC, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
    } else {
      console.error('Subscribe error:', err);
    }
  });
});

client.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});

client.on('message', (topic, message) => {
  const msg = message.toString();
  console.log(`Message received on topic ${topic}: ${msg}`);

  // Emit message to all connected Socket.IO clients
  io.emit('mqtt-message', { topic, message: msg });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
