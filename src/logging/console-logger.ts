import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import Sentry = require('@sentry/node');
import {isString} from "../utils";
import * as pino from 'pino';

@Injectable()
export class ConsoleLogger {

    private pinoLogger = pino();

    log(...args: any[]) {
        // @ts-ignore
        this.pinoLogger.info(...args);
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
        this.pinoLogger.error(error);
    };

    debug = (obj) => {
        this.pinoLogger.debug(obj)
    };

    json(obj) {
        this.pinoLogger.info(obj)
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
