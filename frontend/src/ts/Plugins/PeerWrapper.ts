import Peer from "peerjs";

export default class PeerWrapper {
    static instance: PeerWrapper;
    peer: Peer;

    constructor(auth_token?: string) {
        if (PeerWrapper.instance) {
            return PeerWrapper.instance;
        }

        this.peer = new Peer(undefined, {
            host: 'localhost',
            port: 9000,
            path: '/peerjs',
            token: auth_token
        });

        PeerWrapper.instance = this;
    }
}