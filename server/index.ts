'use strict';

const session = require('express-session');
const http = require('http');
const webSocket = require('ws');
const bodyParser = require('body-parser');
const redis = require("redis");
const roomGenerator = require('./room-generator.ts');
const { promisify } = require("util");
const express = require('express');
const uuid = require('uuid');

require('dotenv').config();

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
  });

const port = process.env.port;
const app = express();
const map = new Map();

app.use(sessionParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/room', function(req, res) {
    const roomId = uuid.v4();
    console.log("GENERATING ROOM");
    req.session.roomId = req.body.roomId;
    res.send({ result: 'OK', message:roomId });
});

app.post('/joinRoom', function(req, res) {
    console.log(`Joining Room with ID: ${req.body.roomId}`);
    req.session.roomId = req.body.roomId;
    console.log('ROOM SESSION ID:');
    console.log(req.session.roomId);
    res.send({ result: 'OK', message:'Joined a room!' });
});

const server = http.createServer(app);
const wss = new webSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request, socket, head) {
    sessionParser(request, {}, () => {
        if (!request.session.roomId) {
            console.log('UNAUTHORIZED ACCESS!');
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, function (ws) {
            wss.emit('connection', ws, request);
        });
    });
});

wss.on('connection', function connection(ws, request) {
    const roomId = request.session.roomId;
    console.log(`A User has connected to a session-based room with id ${roomId}`);
    ws.on('message', function (message) {
        console.log(`Received message ${message} from user ${roomId}`);
        ws.send(message);
      });
    // ws.on('message', function incoming(message) {
    //     wss.clients.forEach(function each(client) {
    //         if (client.readyState === 1) {
    //             client.send("Hey we got a response!");
    //             console.log("MESSAGE SENT?");
    //         }
    //     });
    // });
    // ws.on('close', function close() {
    //     console.log("CLOSING WebSocket Server");
    // });
});

console.log("started the websocket server");
server.listen(port);