import {test} from "../../testing";
import {arrayToReadable} from "../array-to-readable";
import {Writable} from "stream";
import {pipeline} from "../../utils";

test('array to readable stream', async t => {
    let input = ['a', 'b', 'c'];
    let readable = arrayToReadable(input);
    let result: string[] = [];
    let writable = new Writable({
        objectMode: true,
        write(chunk: any, encoding: string, callback): void {
            try {
                result.push(chunk);
                callback();
            } catch (e) {
                callback(e)
            }
        }
    });
    await pipeline(readable, writable);
    t.deepEqual(result, input);
});
