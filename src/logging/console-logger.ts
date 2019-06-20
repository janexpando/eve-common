import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import Sentry = require('@sentry/node');
import {isString} from "../utils";
import safeStringify from 'fast-safe-stringify';

@Injectable()
export class ConsoleLogger {
    log(...args: any[]) {
        console.log(...args);
    }

    error = (error: any) => {
        let sentryId = this.reportError(error);
        if (isString(error)) {
            error = {
                message: error,
                sentryId
            }
        } else {
            error.sentryId = sentryId;
        }
        console.error(this.stringify(error))
    };

    debug = (obj) => {
        console.debug(this.stringify(obj));
    };

    json(obj) {
        console.log(this.stringify(obj));
    }

    private stringify(obj): string {
        if (isString(obj)) return JSON.stringify({message: obj});
        try {
            return JSON.stringify(obj);
        } catch (e) {
            return safeStringify(obj);
        }
    }

    private reportError(error: Error | string): string {
        if (isString(error)) {
            return Sentry.captureMessage(error);
        } else {
            return Sentry.captureException(error);
        }
    }

    companyError(companyId: ObjectId, error) {
        if (isString(error)) {
            error = {
                companyId,
                message: error
            };
        } else {
            error.companyId = companyId;
        }
        this.error(error);
    }
}
