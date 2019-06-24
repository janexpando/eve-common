import stream = require('stream');
import {test} from "../../../testing";
import {pipeline} from "../../../utils";
import {ChunkAggregator} from "../chunk-aggregator";

test('Product listing feed aggregator exact size', async t => {
    const size = 4;
    let inputLimit = 0;
    const input = new stream.Readable({
        objectMode: true,
        read: function() {
            if (inputLimit++ < size) {
                this.push({ foo: 'bar' });
            } else {
                this.push(null);
            }
        },
    });

    const testOutput = new stream.Writable({
        objectMode: true,
        write: (product, encoding, callback) => {
            t.deepEqual(product,[
                {
                    foo: 'bar',
                },
                {
                    foo: 'bar',
                },
                {
                    foo: 'bar',
                },
                {
                    foo: 'bar',
                },
            ]);
            t.is(product.length, size);
            callback();
        },
    });

    input.resume();
    await pipeline(input, new ChunkAggregator(size), testOutput);
});

test('Product listing feed aggregator less than size', async t => {
    const size = 4;
    const realAmount = size - 1;
    let inputLimit = 0;
    const input = new stream.Readable({
        objectMode: true,
        read: function() {
            if (inputLimit++ < realAmount) {
                this.push({ foo: 'bar' });
            } else {
                this.push(null);
            }
        },
    });

    const testOutput = new stream.Writable({
        objectMode: true,
        write: (product, encoding, callback) => {
            t.deepEqual(product, [
                {
                    foo: 'bar',
                },
                {
                    foo: 'bar',
                },
                {
                    foo: 'bar',
                },
            ]);
            t.is(product.length, realAmount);
            callback();
        },
    });

    input.resume();
    await pipeline(input, new ChunkAggregator(size), testOutput);
});

test('Product listing feed aggregator more than size', async t => {
    const size = 4;
    const realAmount = size * 2 - 1;
    let inputLimit = 0;
    const input = new stream.Readable({
        objectMode: true,
        read: function() {
            if (inputLimit++ < realAmount) {
                this.push({ foo: 'bar' });
            } else {
                this.push(null);
            }
        },
    });
    let first = true;
    const testOutput = new stream.Writable({
        objectMode: true,
        write: (product, encoding, callback) => {
            if (first) {
                t.is(product.length, size);
                first = false;
            } else {
                t.is(product.length, realAmount - size);
            }
            callback();
        },
    });

    input.resume();
    await pipeline(input, new ChunkAggregator(size), testOutput);
});
