import Character from "../Character";
import Queue from "../Queue";

export default class BattleQueue extends Queue<Character> {
    private static instance: BattleQueue;

    private constructor() {
        super();
    }

    static getQueue(): BattleQueue {
        if (!BattleQueue.instance) {
            BattleQueue.instance = new BattleQueue();
        }

        return BattleQueue.instance;
    }
}
