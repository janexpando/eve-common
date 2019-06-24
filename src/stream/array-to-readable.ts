import { Readable } from 'stream';

export function arrayToReadable(arr: any[]): Readable {
    return new Readable({
        objectMode: true,
        read(size: number): void {
            for (let item of arr) {
                if (item !== null) this.push(item);
            }
            this.push(null);
        },
    });
}
