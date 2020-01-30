import { Readable, Transform, Writable } from 'stream';
import { ChunkAggregator, pipeline } from '..';

export type PipeFunction = (item: any, push: (item) => void) => Promise<any>;

export async function pipelinify(functions: (PipeFunction | number | Readable | Writable)[]) {
    // TODO tests
    let pipeFunctions = [];

    for (let i = 0; i < functions.length; i++) {
        let pipeFn: PipeFunction = functions[i] as PipeFunction;

        if (i == 0) {
            if (functions[i] instanceof Readable) pipeFunctions.push(functions[i]);
            else
                pipeFunctions.push(
                    new Readable({
                        objectMode: true,
                        async read() {
                            try {
                                await pipeFn(null, item => {
                                    this.push(item);
                                });
                                this.push(null);
                            } catch (e) {
                                this.destroy(e);
                            }
                        },
                    }),
                );
        } else if (i == functions.length - 1) {
            if (functions[i] instanceof Writable) pipeFunctions.push(functions[i]);
            else
                pipeFunctions.push(
                    new Writable({
                        objectMode: true,
                        async write(item: any, encoding: string, callback: (error?: Error | null) => void) {
                            try {
                                await pipeFn(item, null);
                                callback();
                            } catch (e) {
                                callback(e);
                            }
                        },
                    }),
                );
        } else if (typeof functions[i] == 'number') {
            pipeFunctions.push(new ChunkAggregator(functions[i] as number));
        } else {
            pipeFunctions.push(
                new Transform({
                    objectMode: true,
                    async transform(item: any, encoding: string, callback: (error?: Error | null, data?: any) => void) {
                        try {
                            await pipeFn(item, item => {
                                this.push(item);
                            });
                            callback();
                        } catch (e) {
                            callback(e);
                        }
                    },
                }),
            );
        }
    }

    await pipeline(...pipeFunctions);
}
