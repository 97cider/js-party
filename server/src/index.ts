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

app.post('/rejoinRoom', function(req : any, res : any) {
    // TODO: Do some caching to allow a user to rejoin a room after leaving connection
});

app.post('/joinRoom', function(req : any, res : any) {
    const roomId = req.body.roomId;
    const userName = req.body.username;
    
    if (!roomId) {
        return;
    }
    
    let room = map.get(roomId);
    console.log(`${req.body.username} is joining Room with ID: ${req.body.roomId}`);
    req.session.roomId = req.body.roomId;
    room.clients.push(userName);

    if (room.ws) {
        // the room already exists, send a signal letting the other users
        // know that another user has connected
        console.log("HEY THIS ROOM IS ALREADY CREATED! LETS SEND SOME CALLBACKS");
        room.ws.send(JSON.stringify({
            actionType: 'roomConnect', 
            clients: room.clients
        }));
    }
    
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

    //map.set(roomId, ws);
    let currentRoom = map.get(roomId);
    if(!currentRoom) {
        // tried connecting to a nonexistant room
        console.log('Room does not exists! Can not connect')
        return;
    }

    try {
        currentRoom.ws = ws;
        currentRoom.printClients();
    }
    catch(err) {
        console.log(`Error connecting to the room! Error:${err}`);
    }

    ws.on('message', function (message : any) {
        console.log(`Received message ${message} from user ${roomId}`);
        try {
            let data = JSON.parse(message);
            if (data.actionType) {
                console.log("Parsing current room action!");
                currentRoom.parseAction(data.actionType);
            }
            ws.send(message);
        } catch (err) {
            console.log(`Error parsing the message from the client: ${err}`);
        }
      });

    ws.on('close', function (message : any) {
        console.log('Closing connection to websocket.');
        // remove the client from the room, if the room has no clients, 
        // setup a cron job to remove the websocket connection after 24 hours
        // map.delete(roomId);
    });
});

console.log("started the websocket server");
server.listen(port);