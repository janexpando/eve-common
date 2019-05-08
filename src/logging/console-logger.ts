import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import Sentry = require('@sentry/node');
import {isString} from "../utils";
import safeStringify from 'fast-safe-stringify';

@Injectable()
export class ConsoleLogger {
    log = (...args: any[]) => {
        console.log(...args);
    };

    error = (error: Error | string) => {
        console.error(this.stringify(error));
        this.reportError(error);
    };

    debug = (obj) => {
        console.debug(this.stringify(obj));
    };

    json = (obj) => {
        console.log(this.stringify(obj));
    };

    private stringify(obj): string {
        if (isString(obj)) return JSON.stringify({message: obj});
        try {
            return JSON.stringify(obj);
        } catch (e) {
            return safeStringify(obj);
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
        (error as any).companyId = companyId;
        this.reportError(error);
    }
}
