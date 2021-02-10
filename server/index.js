'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const redis = require("redis");
const roomGenerator = require('./room-generator');
const { promisify } = require("util");

require('dotenv').config();

const app = express();
const port = process.env.port;

// const client = redis.createClient();
// const getAsync = promisify(client.get).bind(client);

app.use(bodyParser.json());
app.use(express.urlencoded( { extended: true } ));

if (process.env.NODE_ENV === 'development') {
    console.log("Hey we are in development mode!");
    app.use(function(req, res, next) {
        console.log("Allowing Same Origin Policies");
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

app.get('/', (req, res) => {
    console.log("Poggers you got an API request");
});

app.get('/test', (req, res) => {
    console.log("Got a request from the vue app! nice!");
    res.send("Welcome to 97 Degree Cider!");
});

app.get('/create-room', (req, res) => {
    // Create a new room with a unqiue identifier
    roomGenerator.createRoom();
    res.send("You created a new room! Neato!");
});

app.listen(port);
console.log(`listening on port ${process.env.port}`);
console.log(process.env.NODE_ENV);