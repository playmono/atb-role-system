import GamePlayer from "./GamePlayer.js";

export default class Game {
    constructor(object) {
        this.id = object.id;
        this.startedAt = object.startedAt ?? new Date().toISOString();
        this.finishedAt = object.finishedAt;
        this.gamePlayers = [];
    }

    static createGame(data)  {
        return new Game({
            id: data.id,
        });
    }

    addGamePlayer(data) {
        this.gamePlayers.push(
            GamePlayer.createGamePlayer({
                game: this,
                player: data.player,
                peerId: data.peerId,
                result: data.result
            })
        );
    }
}