import Peer from "peerjs";

export default class PeerWrapper {
    static instance: PeerWrapper;
    peer: Peer;

    constructor(auth_token?: string) {
        if (PeerWrapper.instance) {
            return PeerWrapper.instance;
        }

        this.peer = new Peer({
            host: process.env.APP_URL,
            path: '/peerjs',
            token: auth_token,
            secure: process.env.APP_PROTOCOL === 'https'
        });

        PeerWrapper.instance = this;
    }
}