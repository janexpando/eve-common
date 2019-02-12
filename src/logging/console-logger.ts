import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import Sentry = require('@sentry/node');
import {isString} from "../utils";

@Injectable()
export class ConsoleLogger {
    log(...args: any[]) {
        console.log(...args);
    }

    error = (error: Error | string) => {
        console.error(error);
        this.reportError(error);
    };

    json(obj) {
        try {
            console.log(JSON.stringify(obj));
        } catch (e) {
        }
    }

    private reportError(error: Error | string) {
        if (isString(error)) {
            Sentry.captureMessage(error);
        } else {
            Sentry.captureException(error);
        }
    }

    companyError(companyId: ObjectId, error: Error | string) {
        console.error(`[${companyId}]: `, error);
        this.reportError(error);
    }
}
