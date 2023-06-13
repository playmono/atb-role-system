export default class GamePlayer {
    constructor(object) {
        this.game = object.game;
        this.player = object.player;
        this.peerId = object.peerId;
        this.result = object.result;
    }

    static createGamePlayer(data) {
        return new GamePlayer({
            game: data.game,
            player: data.player,
            peerId: data.peerId,
            result: 'pending'
        });
    }
}