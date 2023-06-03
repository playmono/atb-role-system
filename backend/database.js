import fileSystem from "fs";
import sqlite3 from "sqlite3";
import { DB_NAME } from "./constants.js";
import Player from "./models/Player.js";

const database = {
    save: function(object) {
        switch (true) {
            case object instanceof Player:
                return this.savePlayer(object)
        }
    },

    savePlayer: function(player) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(DB_NAME);
            db.run('INSERT INTO player VALUES (?, ?, ?, ?, ?)', [
                player.id,
                player.username,
                player.password,
                player.rating,
                player.created_at
            ], (error) => {
                error? reject(error) : resolve(player);
            });
            db.close();
        });
    },

    findPlayerByUsername: function(username) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(DB_NAME);
            db.get('SELECT * FROM player WHERE username = ?', [username], (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    const result = !row ? null : new Player({
                        id: row.id, 
                        username: row.username,
                        password: row.password,
                        rating: row.rating,
                        created_at: row.creating_at
                    });
                    resolve(result);
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
                    const result = !row ? null : new Player({
                        id: row.id,
                        username: row.username,
                        password: row.password,
                        rating: row.rating,
                        created_at: row.creating_at
                    });
                    resolve(result);
                }
            });
            db.close();
        });
    },

    create: function() {
        if (fileSystem.existsSync(DB_NAME)) {
            return;
        }
    
        const db = new sqlite3.Database(DB_NAME);
    
        db.serialize(() => {
            this.executeSchemaQuery(db, 'CREATE TABLE player (id TEXT PRIMARY KEY, username TEXT, password TEXT, rating INTEGER, created_at TEXT) STRICT');
            this.executeSchemaQuery(db, 'CREATE TABLE game (id TEXT PRIMARY KEY, started_at TEXT, finished_at TEXT) STRICT');
            this.executeSchemaQuery(db, 'CREATE TABLE player_game (id_game TEXT, id_player TEXT, id_peer TEXT, result TEXT, PRIMARY KEY (id_game, id_player)) STRICT');
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