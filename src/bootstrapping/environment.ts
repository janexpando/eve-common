import 'dotenv/config';
import {Imparsable, imparsable, property} from 'imparsable';
import {Provider, Type} from "injection-js";

export function makeCreateEnvironment<T extends Environment>(type: Type<T>) {
    return (override?: Partial<T>): T => {
        let env = Imparsable.parsePojo(type, process.env);
        if (override) return Object.assign(env, override);
        return env;
    }
}

@imparsable()
export class Environment {
    @property() PORT: number = 8080;
    @property() SENTRY_DSN: string;
    @property() NODE_ENV: string;
    @property() MONGODB_URI: string = 'mongodb://127.0.0.1:27017/app';
    @property() EVE_AUTH_BEARER: string;

    static create = makeCreateEnvironment(Environment);
}

export const ENVIRONMENT_PROVIDER: Provider = {
    provide: Environment,
    useValue: Environment.create()
};
