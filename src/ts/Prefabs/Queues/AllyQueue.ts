import Ally from "../Characters/Ally";
import Queue from "../Queue";

export default class AllyQueue extends Queue<Ally> {
    private static instance: AllyQueue;

    private constructor() {
        super();
    }

    static getQueue(): AllyQueue {
        if (!AllyQueue.instance) {
            AllyQueue.instance = new AllyQueue();
        }

        return AllyQueue.instance;
    }

    enqueue(ally: Ally): void {
        super.enqueue(ally);

        if (this.items.length > 1) {
            return;
        }

        this.getFirst().startTurn();
    }

    nextTurn(): void {
        this.endTurn();

        if (this.isEmpty()) {
            return;
        }

        this.getFirst().startTurn();
    }

    endTurn(): void {
        super.dequeue();
    }
}
