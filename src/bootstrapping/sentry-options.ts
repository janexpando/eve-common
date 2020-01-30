import { Environment } from './environment';
import { NodeOptions } from '@sentry/node';
import { Injectable } from 'injection-js';

@Injectable()
export class SentryOptions implements NodeOptions {
    dsn: string;
    environment: string;
    captureUnhandledRejections = true;
    autoBreadcrumbs = true;

    constructor(env: Environment) {
        this.dsn = env.SENTRY_DSN;
        this.environment = env.NODE_ENV;
    }
}
