import 'dotenv/config';
import {Provider, Type} from "injection-js";
import {object, number, string} from 'joi';

export function makeCreateEnvironment<T extends Environment>(type: Type<T>) {
    return (override?: Partial<T>): T => {
        let env = new type();
        env.init();
        return env;
    }
}

export class Environment {
    PORT: number = 8080;
    SENTRY_DSN: string;
    NODE_ENV: string;
    MONGODB_URI: string;
    EVE_AUTH_BEARER: string;
    SERVICE_URL: string;



    schema = object({
        PORT: number().default(3333),
        SENTRY_DSN: string(),
        NODE_ENV: string().required(),
        MONGODB_URI: string().default('mongodb://127.0.0.1:27017/app'),
        EVE_AUTH_BEARER: string().required(),
        SERVICE_URL: string().required()
    });

    init(){
        this.schema
    }

    static create = makeCreateEnvironment(Environment);
}

export const ENVIRONMENT_PROVIDER: Provider = {
    provide: Environment,
    useValue: Environment.create()
};

class Env2 extends Environment{

}
