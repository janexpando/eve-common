import test from 'ava';
import { QueueProcessor } from '../queue-processor';
import { sleep } from '../../utils';

test('add to queue', async t => {
    let finished = 0;
    const processor: QueueProcessor<number> = new QueueProcessor<number>(
        async n => {
            await sleep(n);
            finished++;
        },
        { concurrency: 5 },
    );

    for (let i = 0; i < 10; i++) {
        processor.addToQueue(i * 10);
        t.truthy(processor.running.length <= 5);
    }
    await processor.finish();
    t.is(finished, 10);
});

test('add running', async t => {
    let finished = 0;
    const processor: QueueProcessor<number> = new QueueProcessor<number>(
        async n => {
            await sleep(n);
            finished++;
        },
        { concurrency: 5 },
    );

    for (let i = 0; i < 10; i++) {
        await processor.addRunning(i * 10);
        t.truthy(processor.running.length <= 5);
    }
    await processor.finish();
    t.is(finished, 10);
});

test('mixed usage', async t => {
    const processor: QueueProcessor<number> = new QueueProcessor<number>(sleep, { concurrency: 3 });

    processor.addToQueue(200);
    t.is(processor.running.length, 1);
    await processor.addRunning(200);
    t.is(processor.running.length, 2);
    await processor.addRunning(1);
    t.is(processor.running.length, 3);
    await sleep(10);
    processor.addToQueue(100);
    t.is(processor.running.length, 3);
    processor.addToQueue(100);
    t.is(processor.running.length, 3);

    await processor.finish();
});

test('handle result', async t => {
    t.plan(3);
    const processor: QueueProcessor<number> = new QueueProcessor<number>(
        async n => {
            if (n === 10) throw new Error('error');
            await sleep(n);
            return n.toString();
        },
        {
            concurrency: 5,
            handleResult: r => {
                t.is(r, '5');
            },
        },
    );

    processor.addToQueue(5);
    processor.addToQueue(5);
    processor.addToQueue(5);
    processor.addToQueue(10);

    await processor.finish();
});

test('handle error', async t => {
    t.plan(1);
    const processor: QueueProcessor<number> = new QueueProcessor<number>(
        async n => {
            await sleep(n);
            if (n === 10) throw new Error('error ' + n);
            return n.toString();
        },
        {
            concurrency: 5,
            handleError: e => {
                t.deepEqual(e, new Error('error 10'));
            },
        },
    );

    processor.addToQueue(5);
    processor.addToQueue(5);
    processor.addToQueue(5);
    processor.addToQueue(10);

    await processor.finish();
});
