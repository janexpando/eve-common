import 'dotenv/config';
import { Injectable, Provider, Type } from 'injection-js';
import { attempt, object, number, string, ObjectSchema } from 'joi';

export function makeCreateEnvironment<T extends Environment>(type: Type<T>) {
    return (override?: Partial<T>): T => {
        let env = new type();
        env.init();
        Object.assign(env, override);
        return env;
    };
}

@Injectable()
export class Environment {
    PORT: number;
    SENTRY_DSN: string;
    NODE_ENV: string;
    DB_URI: string;
    EVE_AUTH_BEARER: string;
    SERVICE_URL: string;
    GATEWAY_URL: string;
    FRONTEND_URL: string;
    SHOPTET_SERVICE_URL: string;
    PRODUCT_SERVICE_URL: string;
    COMPANY_SERVICE_URL: string;
    MALL_SERVICE_URL: string;
    ORDER_DOWNLOADER_URL: string;
    PRICING_SERVICE_URL: string;
    ALZA_SERVICE_URL: string;
    EMAG_SERVICE_URL: string;
    SENDINBLUE_TOKEN: string;

    protected schema: ObjectSchema = object({
        PORT: number().default(3333),
        SENTRY_DSN: string(),
        NODE_ENV: string().required(),
        DB_URI: string().default('mongodb://127.0.0.1:27017/app'),
        EVE_AUTH_BEARER: string().required(),
        SERVICE_URL: string().default('http://127.0.0.1:3333'),
        GATEWAY_URL: string().required(),
        FRONTEND_URL: string().required(),
        SHOPTET_SERVICE_URL: string().required(),
        PRODUCT_SERVICE_URL: string().required(),
        COMPANY_SERVICE_URL: string().required(),
        MALL_SERVICE_URL: string().required(),
        ORDER_DOWNLOADER_URL: string().required(),
        PRICING_SERVICE_URL: string().required(),
        SENDINBLUE_TOKEN: string().required(),
        ALZA_SERVICE_URL: string().required(),
        EMAG_SERVICE_URL: string(),
    }).options({ stripUnknown: true });

    init() {
        Object.assign(this, attempt(process.env, this.schema));
    }

    static create = makeCreateEnvironment(Environment);
}

export const ENVIRONMENT_PROVIDER: Provider = {
    provide: Environment,
    useValue: Environment.create(),
};
