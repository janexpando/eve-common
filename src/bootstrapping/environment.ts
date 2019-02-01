import {Imparsable, imparsable, property} from 'imparsable';
import {Provider} from "injection-js";

@imparsable()
export class Environment {
    @property() PORT: number = 8080;
    @property() SENTRY_DSN: string;
    @property() NODE_ENV: string;

    static create() {
        Imparsable.parsePojo(Environment, process.env);
    }
}

export const ENVIRONMENT_PROVIDER: Provider = {
    provide: Environment,
    useValue: Environment.create()
};
