import { Injectable } from 'injection-js';
import { ConsoleLogger, Environment } from '..';
import * as got from 'got';

export type Iterable<T> = AsyncIterableIterator<T> | IterableIterator<T> | T[];

@Injectable()
export class CallbackResponder {
    constructor(private env: Environment, private logger: ConsoleLogger) {}

    async runIterable<T>(callbackUrl: string, fn: Iterable<T>): Promise<void> {
        for await (let item of fn) {
            await this.send(callbackUrl, item);
        }
    }

    async run<T>(callbackUrl: string, fn: () => T | Promise<T>): Promise<any> {
        let item = await fn();
        return await this.send(callbackUrl, item);
    }

    private async send(url: string, body) {
        return await got.post(url, {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${this.env.EVE_AUTH_BEARER}`,
            },
        });
    }
}
