import 'dotenv/config';
import {Imparsable, imparsable, property} from 'imparsable';
import {Provider} from "injection-js";

@imparsable()
export class Environment {
    @property() PORT: number = 8080;
    @property() SENTRY_DSN: string;
    @property() NODE_ENV: string;
    @property() MONGODB_URI: string = 'mongodb://127.0.0.1:27017/app';
    @property() EVE_AUTH_BEARER: string;

    static create(override?: Partial<Environment>) {
        let env = Imparsable.parsePojo(Environment, process.env);
        if (override) return Object.assign(env, override);
        return env;
    }
}

export const ENVIRONMENT_PROVIDER: Provider = {
    provide: Environment,
    useValue: Environment.create()
};
