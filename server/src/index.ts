const session = require('express-session');
const http = require('http');
const webSocket = require('ws');
const bodyParser = require('body-parser');
const redis = require("redis");
const roomGenerator = require('./room-generator.ts');
const { promisify } = require("util");
const express = require('express');
const uuid = require('uuid');
const Room = require('./room.ts');

require('dotenv').config();

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
  });

const port = process.env.port;
const app = express();
// map of room to roomids
const map = new Map();

app.use(sessionParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req : any, res : any, next : any) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/room', function(req : any, res : any) {
    const roomId = uuid.v4();
    console.log("GENERATING ROOM");

    let room = new Room();
    map.set(roomId, room);

    req.session.roomId = req.body.roomId;
    res.send({ result: 'OK', message:roomId });
});

app.post('/joinRoom', function(req : any, res : any) {
    console.log(`${req.body.username} is joining Room with ID: ${req.body.roomId}`);
    req.session.roomId = req.body.roomId;
    console.log('ROOM SESSION ID:');
    console.log(req.session.roomId);
    res.send({ result: 'OK', message:'Joined a room!' });
});

const server = http.createServer(app);
const wss = new webSocket.Server({ clientTracking: false, noServer: true });

server.on('upgrade', function (request : any, socket : any, head : any) {
    sessionParser(request, {}, () => {
        if (!request.session.roomId) {
            console.log('UNAUTHORIZED ACCESS!');
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, function (ws : any) {
            wss.emit('connection', ws, request);
        });
    });
});

wss.on('connection', function connection(ws : any, request : any) {
    const roomId = request.session.roomId;
    console.log(`A User has connected to a session-based room with id ${roomId}`);

    //map.set(roomId, ws);
    let currentRoom = map.get(roomId);
    if(!currentRoom) {
        // tried connecting to a nonexistant room
        return;
    }

    currentRoom.ws = ws;

    ws.on('message', function (message : any) {
        console.log(`Received message ${message} from user ${roomId}`);
        ws.send(message);
      });

    ws.on('close', function (message : any) {
        console.log('Closing connection to websocket.');
        map.delete(roomId);
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