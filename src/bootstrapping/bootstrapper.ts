import {DbDriver} from "./mongoose";
import {Environment} from "./environment";
import Sentry = require('@sentry/node');
import {SentryOptions} from "./sentry-options";
import {Injectable} from "injection-js";
import {ConsoleLogger} from "..";

@Injectable()
export class Bootstrapper {

    constructor(private dbDriver: DbDriver,
                private env: Environment,
                private logg: ConsoleLogger,
                private sentryOptions: SentryOptions,
                private start: Function,
                private disconnect: boolean = true) {

        this.initSentry();
        this.dbDriver.connected.subscribe(async () => {
            try {
                await this.start();
            } catch (err) {
                console.error(err);
                Sentry.captureException(err);
            } finally {
                if (this.disconnect) await dbDriver.disconnect();
            }
        });

        process.on('SIGINT', async () => {
            await dbDriver.disconnect();
            logg.log('Force to close the MongoDB conection');
            logg.log('Server closed');
            process.exit(0);
        });
    }

    private initSentry() {
        Sentry.init(this.sentryOptions);
    }

    async bootstrap() {
        this.logg.log(this.env);
        try {
            await this.dbDriver.connect();
        } catch (error) {
            this.logg.error(`Error in MongoDb connection: ${error}`);
            Sentry.captureException(error);
            throw error;
        }
    }
}
