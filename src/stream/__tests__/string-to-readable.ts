import {test} from "../../testing";
import {Writable} from "stream";
import {pipeline} from "../../utils";
import {stringToReadable} from "../string-to-readable";

test('string to readable stream', async t => {
    let input = 'sample message';
    let readable = stringToReadable(input);
    let result: string[] = [];
    let writable = new Writable({
        objectMode: true,
        write(chunk: any, encoding: string, callback): void {
            try {
                result.push(chunk.toString());
                callback();
            } catch (e) {
                callback(e)
            }
        }
    });
    await pipeline(readable, writable);
    t.deepEqual(result, [input]);
});
