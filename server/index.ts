'use strict';

const session = require('express-session');
const http = require('http');
const ws = require('ws');
const bodyParser = require('body-parser');
const redis = require("redis");
const roomGenerator = require('./room-generator.ts');
const { promisify } = require("util");
const express = require('express');
const uuid = require('uuid');

require('dotenv').config();

const port = process.env.port;
const app = express();
const map = new Map();

const sessionParser = session({
    saveUninitialized: false,
    secret: 'as$s$s5S5$',
    resave: false
});

app.use(sessionParser);
app.use(express.urlencoded( { extended: true } ));

if (process.env.NODE_ENV === 'development') {
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

app.post('/room', function(req, res) {
    const roomId = uuid.v4();
    console.log("GENERATING ROOM");
    req.session.roomId = roomId;
    res.send({ result: 'OK', message:roomId });
});

const server = http.createServer(app);
const wss = new ws.Server({ server, noServer: true });

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