import { Readable } from 'stream';

export function stringToReadable(data: string): Readable {
    return new Readable({
        read(size: number): void {
            this.push(data);
            this.push(null);
        },
    });
}
