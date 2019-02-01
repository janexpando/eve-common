import {Logger} from "winston";
import {DbDriver} from "./mongoose";
import {Environment} from "./environment";
import Sentry = require('@sentry/node');
import {SentryOptions} from "./sentry-options";
import {Injectable} from "injection-js";

@Injectable()
export class Bootstrapper {

    constructor(private dbDriver: DbDriver,
                private env: Environment,
                private logg: Logger,
                private sentryOptions: SentryOptions,
                private start: Function) {

        this.initSentry();
        this.dbDriver.connected.subscribe(async () => {
            try {
                await this.start();
            } catch (err) {
                console.error(err);
                Sentry.captureException(err);
            } finally {
                await dbDriver.disconnect();
            }
        });

        process.on('SIGINT', async () => {
            await dbDriver.disconnect();
            logg.info('Force to close the MongoDB conection');
            logg.info('Server closed');
            process.exit(0);
        });
    }

    private initSentry() {
        Sentry.init(this.sentryOptions);
    }

    async bootstrap() {
        try {
            await this.dbDriver.connect();
        } catch (error) {
            this.logg.error(`Error in MongoDb connection: ${error}`);
            Sentry.captureException(error);
            throw error;
        }
    }
}
