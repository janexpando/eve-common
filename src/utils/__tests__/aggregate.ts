import { test } from '../../testing';
import { aggregate } from '../aggregate';
import { generate, generateAsync } from './_support';

test('aggregate by 5 sync', async t => {
    let result = [];
    for await (let item of aggregate(5)(generate())) {
        result.push(item);
    }
    t.deepEqual(result, [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
    ]);
});

test('aggregate by 3 sync', async t => {
    let result = [];
    for await (let item of aggregate(3)(generate())) {
        result.push(item);
    }
    t.deepEqual(result, [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
});

test('aggregate by 5 async', async t => {
    let result = [];
    for await (let item of aggregate(5)(generateAsync())) {
        result.push(item);
    }
    t.deepEqual(result, [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
    ]);
});

test('aggregate by 3 async', async t => {
    let result = [];
    for await (let item of aggregate(3)(generateAsync())) {
        result.push(item);
    }
    t.deepEqual(result, [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
});
