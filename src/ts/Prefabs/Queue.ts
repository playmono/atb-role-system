export default class Queue<T> {
    items: T[] = [];

    enqueue(item: T) {
        this.items.push(item);
    }

    getFirst(): T {
        return this.items[0];
    }

    dequeue(): T {
        return this.items.shift();
    }

    getItems(): Array<T> {
        return this.items;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}
