import { test } from '../../testing';
import { LocalSerialProcessor } from '../local-serial-processor';
import { sleep } from '../../utils';

test('process serially', async t => {
    let count = 0;
    let isProcessing = false;
    let processFn = async (x: {}) => {
        if (isProcessing) {
            t.fail('2 or more concurrent processes cannot run at the same time');
        }
        isProcessing = true;
        count++;
        await sleep(50);
        isProcessing = false;
    };
    let errorFn = e => {};
    let processor = new LocalSerialProcessor<{}>(processFn, errorFn);

    processor.add({});
    await sleep(10);
    processor.add({});
    await sleep(10);
    t.is(processor.queue.length, 2);
    processor.add({});
    await sleep(10);
    processor.add({});
    await sleep(300);
    t.is(processor.queue.length, 0);
    t.is(count, 4);
    t.pass();
});

test('process serially - paused insert', async t => {
    let count = 0;
    let isProcessing = false;
    let processFn = async (x: {}) => {
        if (isProcessing) {
            t.fail('2 or more concurrent processes cannot run at the same time');
        }
        isProcessing = true;
        count++;
        await sleep(50);
        isProcessing = false;
    };
    let errorFn = e => {};
    let processor = new LocalSerialProcessor<{}>(processFn, errorFn);

    processor.add({});
    processor.add({});
    await sleep(120);
    t.is(processor.queue.length, 0);
    processor.add({});
    processor.add({});
    await sleep(120);
    t.is(count, 4);
    t.is(processor.queue.length, 0);
    t.pass();
});