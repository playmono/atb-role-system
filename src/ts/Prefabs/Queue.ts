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

    putFirst(item: T): void {
        const indexOfFound = this.getItems().indexOf(item);

        if (indexOfFound === -1)  {
            return;
        }

        this.items.splice(indexOfFound, 1);
        this.items.unshift(item);
    }

    getItems(): Array<T> {
        return this.items;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}
