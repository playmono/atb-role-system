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
        if (GameServer.instance) {
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
            if (message.type === 'challenge') {
                this.challengeId = message.data.challengeId
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

    public async challengePlayer(player: any): Promise<void> {
        if (player.id === this.player.id) {
            throw Error('A player cannot challenge themself');
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
    }

    public async acceptChallenge(): Promise<void> {
        const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
        const response = await fetch(`${url}/accept-challenge/${this.challengeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token
            },
            body: JSON.stringify({})
        });
    }
}