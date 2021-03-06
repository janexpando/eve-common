import { Injectable } from 'injection-js';
import { Environment } from '../bootstrapping/environment';
import got = require('got');
import { GotInstance, GotJSONFn } from 'got';

@Injectable()
export abstract class EveClient {
    protected baseUrl: string = 'https://eve.expan.do';

    constructor(protected env: Environment) {}

    get got(): GotInstance<GotJSONFn> {
        let token = this.env.EVE_AUTH_BEARER;
        return got.extend({
            baseUrl: this.baseUrl,
            json: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
