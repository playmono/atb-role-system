import fileSystem from "fs";
import sqlite3 from "sqlite3";
import { DB_NAME } from "./constants.js";
import Player from "./models/Player.js";
import Game from "./models/Game.js";
import GamePlayer from "./models/GamePlayer.js";

const database = {
    save: function(object) {
        switch (true) {
            case object instanceof Player:
                return this.savePlayer(object);
            case object instanceof Game:
                return this.saveGame(object);
        }
    },

    savePlayer: function(player) {
        return new Promise((resolve, reject) => {
            if (!player.password) {
                reject('Password cannot be null');
                return;
            }
            const db = new sqlite3.Database(DB_NAME);
            db.run('REPLACE INTO player VALUES (?, ?, ?, ?, ?)', [
                player.id,
                player.username,
                player.password,
                player.rating,
                player.createdAt
            ], (error) => {
                error? reject(error) : resolve(player);
            });
            db.close();
        });
    },

    saveGame: function(game) {
        const promises =  [];
        let promiseQuery = new Promise ((resolve, reject) => {
            const db = new sqlite3.Database(DB_NAME);
            db.run('REPLACE INTO game VALUES (?, ?, ?)', [
                game.id,
                game.startedAt,
                game.finishedAt
            ], (error) => {
                error? reject(error) : resolve(game);
            });
            db.close();
        });
        promises.push(promiseQuery);
        game.gamePlayers.forEach((gamePlayer) => {
            promiseQuery = new Promise((resolve, reject) => {
                const db = new sqlite3.Database(DB_NAME);
                db.run('REPLACE INTO game_player VALUES (?, ?, ?, ?)', [
                    gamePlayer.game.id,
                    gamePlayer.player.id,
                    gamePlayer.peerId,
                    gamePlayer.result
                ], (error) => {
                    error? reject(error) : resolve(gamePlayer);
                });
                db.close();
            });
            promises.push(promiseQuery);
            promises.push(this.savePlayer(gamePlayer.player));
        });

        return Promise.all(promises);
    },

    findPlayerByUsername: function(username) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(DB_NAME);
            db.get('SELECT * FROM player WHERE username = ?', [username], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.mapRowToPlayer(row));
                }
            });
            db.close();
        });
    },

    findPlayerById: function(id) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(DB_NAME);
            db.get('SELECT * FROM player WHERE id = ?', [id], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.mapRowToPlayer(row));
                }
            });
            db.close();
        });
    },

    findGameById: function(id) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(DB_NAME);
            db.all('SELECT * FROM game LEFT JOIN game_player ON game.id = game_player.id_game LEFT JOIN player ON game_player.id_player = player.id WHERE game.id = ?', [id], (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.mapRowsToGame(rows));
                }
            });
            db.close();
        });
    },

    mapRowToPlayer: function(row) {
        return !row ? null : new Player({
            id: row.id,
            username: row.username,
            password: row.password,
            rating: row.rating,
            createdAt: row.creating_at
        });
    },

    mapRowsToGame: function(rows) {
        if (rows.length === 0) {
            return null;
        }

        const game = new Game({
            id: rows[0].id_game,
            startedAt: rows[0].started_at,
            finishedAt: rows[0].finished_at
        });

        game.gamePlayers = rows.map((row) => {
           const gamePlayer = this.mapRowToGamePlayer(row);
           gamePlayer.game = game;
           return gamePlayer;
        });

        return game;
    },

    mapRowToGamePlayer: function(row) {
        if (!row) {
            return null;
        }

        const game = Game.createGame({
            id: row.id_game,
            startedAt: row.started_at,
            finishedAt: row.finished_at
        });
        const player = new Player({
            id: row.id_player,
            username: row.username,
            password: row.password,
            rating: row.rating,
            createdAt: row.creating_at
        });
        return GamePlayer.createGamePlayer({
            game: game,
            player: player,
            peerId: row.id_peer,
            result: row.result
        });
    },

    create: function() {
        console.log('Database path', DB_NAME);
        if (fileSystem.existsSync(DB_NAME)) {
            return;
        }
    
        const db = new sqlite3.Database(DB_NAME);
    
        db.serialize(() => {
            this.executeSchemaQuery(db, 'CREATE TABLE player (id TEXT PRIMARY KEY, username TEXT, password TEXT, rating INTEGER, created_at TEXT) STRICT');
            this.executeSchemaQuery(db, 'CREATE TABLE game (id TEXT PRIMARY KEY, started_at TEXT, finished_at TEXT) STRICT');
            this.executeSchemaQuery(db, 'CREATE TABLE game_player (id_game TEXT, id_player TEXT, id_peer TEXT, result TEXT, PRIMARY KEY (id_game, id_player)) STRICT');
        });
        db.close();
    },

    executeSchemaQuery: function(db, query) {
        db.run(query, (error) => {
            if (error !== null) {
                fileSystem.rmSync(DB_NAME);
                throw error;
            }
        });
    }
}

export default database;