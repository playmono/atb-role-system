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
            this.configureOnHold(ally);
            return;
        }

        this.getFirst().startTurn();
    }

    public nextTurn(): void {
        this.endTurn();

        if (this.isEmpty()) {
            return;
        }

        this.getFirst().startTurn();
    }

    private endTurn(): void {
        if (this.isEmpty()) {
            return;
        }

        const hero = this.getFirst();
        this.disconfigureOnHold(hero);
        hero.endTurn();
        super.dequeue();
    }

    private configureOnHold(ally: Ally): void {
        ally.sprite.on('pointerdown', (pointer) => {
            this.getFirst().holdTurn();
            this.configureOnHold(this.getFirst());
            this.putFirst(ally);
            this.getFirst().startTurn();
        });
    }

    private disconfigureOnHold(ally: Ally): void  {
        ally.sprite.off('pointerdown');
    }
}
