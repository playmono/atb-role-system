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

    public enqueue(ally: Ally): void {
        super.enqueue(ally);

        if (this.items.length > 1) {
            return;
        }

        this.getFirst().startTurn();
    }

    public nextTurn(): void {
        const hero = this.getFirst();
        hero.sprite.emit('endTurn');
        this.endTurn();

        if (this.isEmpty()) {
            return;
        }

        this.getFirst().startTurn();
    }

    private endTurn(): void {
        super.dequeue();
    }
}
