import {test} from "../../testing";
import {iteratorToArray} from "../iterator-to-array";
import {generate, generateAsync} from "./_support";

test('iterator to array', async t => {
    let arr = await iteratorToArray(generate());
    t.deepEqual(arr, [0, 1, 2, 4, 5, 6, 7, 8, 9]);
    arr = await iteratorToArray(generateAsync());
    t.deepEqual(arr, [0, 1, 2, 4, 5, 6, 7, 8, 9]);
});
