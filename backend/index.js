import { PORT, JWT_SECRET } from "./constants.js";
import express from "express";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import bodyParser from "body-parser";
import database from "./database.js";
import Player from "./models/Player.js";
import passwordHash from "pbkdf2-password-hash";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

const users = new Map();
const challenges = new Map();

database.create();

const app = express();

app.use(cors());
app.use(bodyParser.json());
//app.get("/", (req, res, next) => res.send("Hello world!"));

app.post("/sign-up", async (req, res) => {
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
            return new Promise((resolve, reject) => {
                users.forEach((user) => {
                    if (user.player.id === player.id) {
                        const e = new Error('User is already logged');
                        e.code = "UNAUTHORIZED";
                        reject(e);
                    }
                });

                resolve();
            });
        })
        .then(() => {
            const token = jwt.sign({id: player.id}, JWT_SECRET, { expiresIn: '24h' });
            res.status(200).send(JSON.stringify({auth_token: token}));
        })
        .catch ((error) => {
            console.log(error);
            return sendError(res, error);
        });
});

app.get("/get-player-by-client-id/:clientId", authenticateToken, (req, res) => {
    console.log('Received GET /get-player-by-client-id/');
    const user = users.get(req.params.clientId);
    if (!user) {
        return sendError(res, {code: 404, message: 'Player not found'});
    }
    res.status(200).send(JSON.stringify(user.player));
});

app.post("/challenges", authenticateToken, (req, res) => {
    console.log('Received POST /challenge-player');
    const user = getUserByPlayerId(req.body.playerId);
    if (!user) {
        return sendError(res, {code: 404, message: 'Player not found'});
    }

    if (playerIsAlreadyInChallenge(user.player.id)) {
        return sendError(res, {code: 409, message: `Player ${user.player.username} already in challenge`});
    }

    const challengeId = req.body.challengeId;

    challenges.set(challengeId, {
        from: req.user,
        to: user
    });

    // set players as challenged in internal array
    req.user.player.status = 'challenged';
    user.player.status = 'challenged';

    // set to all clients that these users are in pending
    sendToAllClients({
        type: 'playerUpdate',
        data: {
            players: [
                req.user.player,
                user.player
            ]
        }
    });

    // Send the challenge to the player requested
    user.client.send({
        type: 'challengeOffer',
        data: {
            challengeId: challengeId,
            from: req.user.player
        }
    });

    // Send OK to the user that request the challenge
    res.status(200).send(JSON.stringify(challengeId));
});

app.put("/challenge/:challengeId", authenticateToken, (req, res) => {
    console.log('Received PUT /challenge');
    const challenge = challenges.get(req.params.challengeId);
    if (!challenge) {
        return sendError(res, {code: 404, message: 'Challenge not found'});
    }
    if (challenge.to.player.id !== req.user.player.id && req.body.status === 'accept') {
        return sendError(res, {code: 403, message: 'Anoter player cannot accept the challenge'});
    }

    if (req.body.status === 'accept') {
        challenge.to.player.status = 'ingame';
        challenge.from.player.status = 'ingame';
    } else if (req.body.status === 'decline') {
        challenge.to.player.status = 'pending';
        challenge.from.player.status = 'pending';
    }

    // send to all players that the challenge has been declined or accepted
    sendToAllClients({
        type: 'playerUpdate',
        data: {
            players: [
                challenge.to.player,
                challenge.from.player
            ]
        }
    });

    // create new game instance
    challenges.delete(req.params.challengeId);

    const data = {
        type: 'challengeResponse',
        data: {
            status: req.body.status,
            challengeId: req.params.challengeId,
        }
    };

    challenge.to.client.send(data);
    challenge.from.client.send(data);
});

app.get("/active-players", authenticateToken, (req, res) => {
    console.log('Received GET /active-players');
    let players = [];
    users.forEach((user) => {
        players.push(user.player);
    })
    res.status(200).send(JSON.stringify(players));
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
            errorMessage = errorMessage ?? "Something went wrong";
            break;
    }
    return res.status(errorCode).send(JSON.stringify({errorCode: errorCode, errorMessage: errorMessage}));
}

// =======

console.log('Server up listening on port ' + PORT + '... ');
const server = app.listen(PORT);

const peerServer = ExpressPeerServer(server, {
    debug: true,
    allow_discovery: true
});

app.use('/peerjs', peerServer);

peerServer.on('disconnect', (disconnectedClient) => {
    const playerDisconnected = users.get(disconnectedClient.getId());
    sendToAllClients({
        type: 'disconnect',
        data: playerDisconnected.player.id
    });
    users.delete(disconnectedClient.getId());
});

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
        sendToAllClients({
            type: 'connect',
            data: player
        });
        users.set(client.id, new User(player, client));
    })
    .catch ((error) => {
        console.log(error);
        client.socket.close();
    });
});

function authenticateToken(req, res, callback) {
    const token = req.headers['authorization'];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, async (error, decoded) => {
        if (error) return res.sendStatus(403);
        const player = await database.findPlayerById(decoded.id);
        const user = getUserByPlayerId(player.id);
        if (!user) return res.sendStatus(500);
        req.user = user;
        callback();
    });
}

function getUserByPlayerId(playerId) {
    for (let [key, user] of users) {
        if (user.player.id === playerId) {
            return user;
        }
    }

    return null;
}

function playerIsAlreadyInChallenge(playerId) {
    for (let[key, challenge] of challenges) {
        if (challenge.to.player.id === playerId || challenge.from.player.id === playerId) {
            return true;
        }
    }

    return false;
}

function sendToAllClients(data) {
    for (let [key, user] of users) {
        user.client.send(data);
    }
}