import {Injectable} from "injection-js";
import request = require('request-promise-native');
import {ConsoleLogger, Environment} from "..";

export interface IterableFn<T> {
    (): AsyncIterableIterator<T> | IterableIterator<T> | T[];
}

@Injectable()
export class CallbackResponder {
    constructor(private env: Environment, private logger: ConsoleLogger) {
    }

    async runIterable<T>(callbackUrl: string, fn: IterableFn<T>): Promise<void> {
        try {
            for await (let item of fn()) {
                await this.send(callbackUrl, item);
            }
        } catch (e) {
            this.logger.error(e);
        }
    }

    async run<T>(callbackUrl: string, fn: () => T | Promise<T>): Promise<void> {
        try {
            let item = await fn();
            return await this.send(callbackUrl, item);
        } catch (e) {
            this.logger.error(e);
        }
    }

    private async send(url: string, body) {
        return await request.post(url, {
            body,
            json: true,
            auth: {
                bearer: this.env.EVE_AUTH_BEARER,
            }
        });
    }
}
