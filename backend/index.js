import { APP_PORT, DB_NAME } from "./constants.js";
import express from "express";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import bodyParser from "body-parser";
import database from "./database.js";
import Player from "./models/Player.js";
import passwordHash from "pbkdf2-password-hash";

database.create();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res, next) => res.send("Hello world!"));

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

			switch (error.code) {
				case "VALIDATION_ERROR":
					res.status(412).send(JSON.stringify({errorCode: 412, erorrMessage: error.message}));
				default:
					return res.status(500).send(JSON.stringify({errorCode: 500, erorrMessage: "Something went wrong"}));
			}
		});
});

app.post("/login", (req, res) => {
	console.log('Received POST /login');
	const data = req.body;

	database.findPlayerByUsername(data.username)
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
	.then((player) => passwordHash.compare(data.password, player.password))
	.then((isValid) => {
		if (isValid) {
			res.status(200).send({message: "OK"});
		} else {
			res.status(401).send(JSON.stringify({errorCode: 401, erorrMessage: "Unauthorized"}));
		}
	})
	.catch ((error) => {
		console.log(error);

		switch (error.code) {
			case "NOT_FOUND":
				return res.status(404).send(JSON.stringify({errorCode: 404, erorrMessage: error.message}));
			default:
				return res.status(500).send(JSON.stringify({errorCode: 500, erorrMessage: "Something went wrong"}));
		}
	});
});

// =======

console.log('Server up listening on port ' + APP_PORT + '... ');
const server = app.listen(APP_PORT);

/*
const peerServer = ExpressPeerServer(server, {
	path: "/myapp",
});

app.use("/peerjs", peerServer);
*/
