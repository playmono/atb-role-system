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
            ally.sprite.on('pointerdown', (pointer) => {
                /*
                const tempQueue = [];
                this.getFirst().sprite.emit('holdTurn');
                while(this.getFirst() !== ally) {
                    const first = this.dequeue();
                    tempQueue.push(first);
                }
                tempQueue.reverse().forEach((onHold) => {
                    this.enqueue(onHold);
                });
                this.getFirst().startTurn();
                */
            });
            return;
        }

        this.getFirst().sprite.emit('startTurn');
    }

    public nextTurn(): void {
        this.endTurn();

        if (this.isEmpty()) {
            return;
        }

        this.getFirst().sprite.emit('startTurn');
    }

    private endTurn(): void {
        if (this.isEmpty()) {
            return;
        }

        const hero = this.getFirst();
        hero.sprite.emit('endTurn');
        super.dequeue();
    }
}
