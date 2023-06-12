import GamePlayer from "./GamePlayer.js";

export default class Game {
    constructor(object) {
        this.id = object.id;
        this.started_at = this.started_at ?? new Date().toISOString();
        this.finished_at = null;
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