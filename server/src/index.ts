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

const server = http.createServer(app);
let wss = new webSocket.Server({ noServer: true });

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
    room.wss = new webSocket.Server({ noServer: true }); 

    room.wss.on('connection', function connection(ws : any, request : any) {
        ws.on('message', function (message : any) {
            console.log(`Received message ${message} from user ${roomId}`);
            try {
                let data = JSON.parse(message);
                if (data.actionType) {
                    console.log("Parsing current room action!");
                    room.parseAction(data);
                }
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
    res.send({ result: 'OK', message:'Joined a room!' });
});

app.post('/trySync', function(req : any, res : any) {
    console.log("WE ARE DOING SOME SYNCING");
    const roomId = req.body.roomId;
    console.log(roomId);
    let room = map.get(roomId);

    if (room.activeUrl != undefined) {
        // the room already exists, send a signal letting the other users
        // know that another user has connected
        console.log("HEY THIS ROOM IS ALREADY CREATED! LETS SEND SOME CALLBACKS");
        console.log(room.activeUrl);
        // room.ws.send(JSON.stringify({
        //     actionType: 'roomConnect', 
        //     clients: room.clients
        // }));
        // room.wss.clients.forEach((ws : any) => {
        //     ws.send(JSON.stringify({
        //         actionType: 'roomConnect', 
        //         clients: room.clients
        //     }));
        // });
        console.log("Begin Video Sync");
        room.BeginVideoSync();
    }

});

server.on('upgrade', function (request : any, socket : any, head : any) {
    sessionParser(request, {}, () => {
        if (!request.session.roomId) {
            console.log('UNAUTHORIZED ACCESS!');
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }

        let room = map.get(request.session.roomId);
        room.wss.handleUpgrade(request, socket, head, function (ws : any) {
            room.wss.emit('connection', ws, request);
        });
    });
});
console.log(`Started the js-party server on port ${port}`);
server.listen(port);