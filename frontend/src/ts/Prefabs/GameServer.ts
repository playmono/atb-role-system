import Peer from "peerjs";
import { v4 as uuidv4 } from 'uuid';

export default class GameServer {
    static instance: GameServer;
    peer: Peer;
    player = null;
    playerList = [];
    token: string;
    challengeId: string = null;

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
            secure: process.env.APP_PROTOCOL === 'https'
        });

        this.peer.socket.on('message', (message) => {
            if (message.type === 'connect') {
                this.addToPlayerList(message.data);
            }
            if (message.type === 'disconnect') {
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

        GameServer.instance = this;
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
        })
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
        })
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

    public async respondChallenge(status: string): Promise<void> {
        const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
        const response = await fetch(`${url}/challenge/${this.challengeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token
            },
            body: JSON.stringify({status: status})
        });
    }

    public challengeResponse(data): void {
        if (this.challengeId !== data.challengeId) {
            console.error('error. challenge id different');
            return;
        }

        if (data.status === 'decline') {
            this.challengeId = null;
        }
    }

    public closeConnection(): void {
        this.peer.destroy();
    }
}