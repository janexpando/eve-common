const util = require('util');
import * as stream from 'stream';

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const pipeline = util.promisify(stream.pipeline);

export function isString(obj): obj is string {
    return typeof obj == 'string' || obj instanceof String;
}
