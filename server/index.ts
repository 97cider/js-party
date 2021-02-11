'use strict';

const http = require('http');
const ws = require('ws');
const bodyParser = require('body-parser');
const redis = require("redis");
const roomGenerator = require('./room-generator.ts');
const { promisify } = require("util");

require('dotenv').config();

const port = process.env.port;
const server = http.createServer();
const wss = new ws.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        wss.clients.forEach(function each(client) {
            console.log("SENDING DATA TO CLIENT");
            if (client.readyState === 1) {
                client.send(message);
                console.log("MESSAGE SENT?");
            }
        });
    });
});

console.log("started the websocket server");
server.listen(port);