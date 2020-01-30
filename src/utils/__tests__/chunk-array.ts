import { test } from '../../testing';
import { chunkArray } from '../chunk-array';

test('chunk array', async t => {
    let arrays = chunkArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
    t.deepEqual(arrays, [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
});
