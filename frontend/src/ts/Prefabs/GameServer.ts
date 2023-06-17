import Peer, { DataConnection } from "peerjs";
import { v4 as uuidv4 } from 'uuid';

export default class GameServer {
    static instance: GameServer;
    peer: Peer;
    player = null;
    playerList = [];
    token: string;
    challengeId: string = null;
    game = null;
    gameConnection: DataConnection = null;

    constructor(auth_token?: string) {
        if (GameServer.instance && !auth_token) {
            return GameServer.instance;
        }

        this.token = auth_token;

        this.peer = new Peer({
            host: process.env.APP_URL,
            port: parseInt(process.env.APP_PORT),
            path: '/peerjs',
            token: auth_token,
            secure: process.env.APP_PROTOCOL === 'https',
            //debug: 3
        });

        this.configureListeners();

        GameServer.instance = this;
    }

    public configureListeners(): void {
        this.peer.socket.on('message', (message) => {
            console.log('message captured in gameServer:configureListeners:message', message);
            if (message.type === 'gameConnect') {
                this.addToPlayerList(message.data);
            }
            if (message.type === 'gameDisconnect') {
                this.removeFromPlayerList(message.data);
            }
            if (message.type === 'challengeOffer') {
                this.challengeId = message.data.challengeId
            }
            if (message.type === 'playerUpdate') {
                this.updatePlayerList(message.data.players);
            }
            if (message.type === 'challengeResponse') {
                this.challengeResponse(message.data);
            }
        });

        this.peer.on('connection', (conn) => {
            conn.on('open', () => {
                console.log('message captured in gameServer:configureListeners:open');
                this.gameConnection = conn;
            });
        });
    }

    public unconfigureListeners(): void {
        this.peer.socket.off('message');
        this.peer.off('connection');
    }

    public async setPlayer(): Promise<void> {
        const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
        const response = await fetch(`${url}/get-player-by-client-id/${this.peer.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token
            },
        });
        this.player = await response.json();
    }

    public async setPlayerList(): Promise<void> {
        const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
        const response = await fetch(`${url}/active-players`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token
            },
        });
        const data = await response.json();

        data.forEach((player) => {
            if (player.id !== this.player.id) {
                this.playerList.push(player);
            }
        });
    }

    public addToPlayerList(player: any): void {
        this.playerList.push(player);
    }

    public removeFromPlayerList(playerId: string): void {
        this.playerList = this.playerList.filter((obj) => obj.id !== playerId);
    }

    public updatePlayerList(players: any): void {
        players.forEach((player) => {
            const found = this.playerList.findIndex((element) => element.id === player.id);
            if (found !== -1) {
                this.playerList.splice(found, 1, player);
            }
            if (player.id === this.player.id) {
                this.player = player;
            }
        });
    }

    public challengePlayer(player: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (player.id === this.player.id) {
                reject('A player cannot challenge themself');
            }
            const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
            this.challengeId = uuidv4();
            const data = {
                challengeId: this.challengeId,
                playerId: player.id,
            };
            const response = await fetch(`${url}/challenges`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.token
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();

            if (response.status === 200) {
                resolve('');
            } else {
                reject(responseData.errorMessage);
            }
        });
    }

    public async respondChallenge(status: string, callback?: Function): Promise<void> {
        const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
        const response = await fetch(`${url}/challenge/${this.challengeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token
            },
            body: JSON.stringify({status: status})
        });
        const responseData = await response.json();
        if (responseData.data.status === 'accept') {
            this.game = responseData.data.game;
            const conn = this.peer.connect(this.getOppositeGamePlayer().peerId);
            conn.once('open', () => {
                console.log('message captured in gameServer:respondChallenge:open');
                this.gameConnection = conn;
                conn.send({type: 'startGame'});
                callback();
            });
            conn.on("error", (err) => {
                console.log(err);
            });
            conn.on('close', () => {
                //endCall()
            });
        } else {
            callback();
        }
    }

    public challengeResponse(data: any): void {
        if (this.challengeId !== data.game.id) {
            console.error('error. challenge id different');
            return;
        }
        this.game = data.game;
        this.challengeId = null;
    }

    public getOppositeGamePlayer() {
        return this.game.gamePlayers.find((gamePlayer) => gamePlayer.player.id !== this.player.id);
    }

    public closeConnection(): void {
        this.peer.destroy();
    }

    public async sendGameResult(won: boolean, onSuccess: Function, onError: Function): Promise<void> {
        const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
        const response = await fetch(`${url}/games/${this.game.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token
            },
            body: JSON.stringify({
                from: this.player.id,
                winnerId: won ? this.player.id : this.getOppositeGamePlayer().player.id
            })
        });
        if (response.status === 200) {
            onSuccess();
        } else {
            onError();
        }
    }

    public endGame(): void {
        this.game = null;
        this.gameConnection.close();
        this.setPlayer();
    }
}