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
        if(isString(error)){
            error = {
                message: error,
                sentryId
            }
        }
        try {
            console.error(JSON.stringify(error));
        } catch (e) {
            console.error(safeStringify(error));
        }
    };

    json(obj) {
        try {
            console.log(JSON.stringify(obj));
        } catch (e) {
            console.log(safeStringify(obj));
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
        if(isString(error)){
            error = {
                message: error,
                companyId
            }
        }
        this.error(error);
    }
}
