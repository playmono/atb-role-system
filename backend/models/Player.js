import passwordHash from "pbkdf2-password-hash";
import { v4 as uuidv4 } from 'uuid';

export default class Player {
    static defaultRating = 1500;
    static idRegExp = /^[\w\-]{36}$/;
    static usernameRegExp = /^[\w]{4,30}$/;
    static passwordRegExp = /^[\w]{8,30}$/;
    static ratingRegExp = /^\d+$/;

    constructor(object) {
        this.id = object.id;
        this.username = object.username;
        this.password = object.password;
        this.rating = object.rating;
        this.created_at = this.created_at ?? new Date().toISOString();
        this.status = 'pending';
    }

    static validateData(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.username == null || !Player.usernameRegExp.test(data.username)) {
                    throw Error(`username [${data.username}] has invalid format. 4-30 alphanumeric characters allowed`);
                }
        
                if (data.password == null || !Player.passwordRegExp.test(data.password)) {
                    throw Error("password has invalid format. 8-30 alphanumeric characters allowed");
                }
                resolve(data);
            } catch (e) {
                e.code = 'VALIDATION_ERROR';
                reject(e);
            }
        });
    }

    hidePassword() {
        delete(this.password);
    }

    static createPlayer(data)  {
        return passwordHash.hash(data.password)
            .then((hash) => {
                return new Promise((resolve, reject) => {
                    const player = new Player({
                        id: uuidv4(),
                        username: data.username,
                        password: hash,
                        rating: Player.defaultRating
                    });
                    resolve(player);
                });
            });
    }
}