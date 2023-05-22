import { APP_PORT, JWT_SECRET } from "./constants.js";
import express from "express";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import bodyParser from "body-parser";
import database from "./database.js";
import Player from "./models/Player.js";
import passwordHash from "pbkdf2-password-hash";
import jwt from "jsonwebtoken";

let activePlayers = new Map();

database.create();

const app = express();

app.use(cors());
app.use(bodyParser.json());
//app.get("/", (req, res, next) => res.send("Hello world!"));

app.post("/sign-up", (req, res) => {
    console.log('Received POST /sign-up');
    const data = req.body;

    Player.validateData(data)
        .then((data) => database.findPlayerByUsername(data.username))
        .then((player) => {
            return new Promise((resolve, reject) => {
                if (player) {
                    const e = new Error('Username already exists.');
                    e.code = "VALIDATION_ERROR";
                    reject(e);
                } else {
                    resolve();
                }
            })
        })
        .then(() => Player.createPlayer({username: data.username, password: data.password}))
        .then((player) => database.save(player))
        .then((player) => {
            console.log(`player ${player.username} saved`);
            player.hidePassword();
            res.send(player);
        })
        .catch ((error) => {
            console.log(error);
            return sendError(res, error);
        });
});

app.post("/login", (req, res) => {
    console.log('Received POST /login');
    const data = req.body;

    let player;

    database.findPlayerByUsername(data.username)
        .then((playerFound) => {
            return new Promise((resolve, reject) => {
                if (!playerFound) {
                    const e = new Error('Player not found');
                    e.code = "NOT_FOUND";
                    reject(e);
                } else {
                    player = playerFound;
                    resolve(player);
                }
            });
        })
        .then((player) => passwordHash.compare(data.password, player.password))
        .then((isValid) => {
            return new Promise((resolve, reject) => {
                if (!isValid) {
                    const e = new Error('Unauthorized');
                    e.code = "UNAUTHORIZED";
                    reject(e);
                } else {
                    resolve();
                }
            });
        })
        .then(() => {
            const token = jwt.sign({id: player.id}, JWT_SECRET, { expiresIn: '30s' });
            res.status(200).send(JSON.stringify({auth_token: token}));
        })
        .catch ((error) => {
            console.log(error);
            return sendError(res, error);
        });
});

app.get("/active-players", (req, res) => {
    console.log('Received GET /active-players');
    res.status(200).send(JSON.stringify(Array.from(activePlayers.entries())));
});

function sendError(res, error) {
    let errorCode = 500;
    let errorMessage = error.message;
    switch (error.code) {
        case "VALIDATION_ERROR":
            errorCode = 412;
            break;
        case "NOT_FOUND":
            errorCode = 404;
            break;
        case "UNAUTHORIZED":
            errorCode = 401;
            break;
        default:
            errorMessage = "Something went wrong";
            break;
    }
    return res.status(errorCode).send(JSON.stringify({errorCode: errorCode, errorMessage: errorMessage}));
}

// =======

console.log('Server up listening on port ' + APP_PORT + '... ');
const server = app.listen(APP_PORT);

const peerServer = ExpressPeerServer(server, {
    debug: true,
    allow_discovery: true
});

app.use('/peerjs', peerServer);

peerServer.on('disconnect', (client) => { console.log('client disconnected');});

peerServer.on('connection', client => {
    console.log('Received a peer server connection request');

    new Promise((resolve, reject) => {
        jwt.verify(client.token, JWT_SECRET, (error, decoded) => {
            if (error) {
                reject(error);
            } else {
                resolve(decoded);
            }
        });
    })
    .then((decoded) => database.findPlayerById(decoded.id))
    .then((player) => {
        return new Promise((resolve, reject) => {
            if (!player) {
                const e = new Error('Player not found');
                e.code = "NOT_FOUND";
                reject(e);
            } else {
                resolve(player);
            }
        });
    })
    .then((player) => {
        player.hidePassword();
        activePlayers.set(client.id, player);
    })
    .catch ((error) => {
        console.log(error);
        client.socket.close();
    });
});