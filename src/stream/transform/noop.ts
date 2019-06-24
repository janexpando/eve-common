import { Transform } from 'stream';

export function noopTransform() {
    return new Transform({
        transform(
            chunk: any,
            encoding: string,
            callback: (error?: Error, data?: any) => void,
        ): void {
            this.push(chunk, encoding);
            callback();
        },
    });
}
