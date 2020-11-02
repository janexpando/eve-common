import test from 'ava';
import { QueueProcessor } from '../queue-processor';
import { sleep } from '../../utils';

interface ITest {
    processDuration: number;
    message: string;
    index: number;
}

test('add to queue', async t => {
    let finished = 0;
    const processor: QueueProcessor<ITest> = new QueueProcessor<ITest>(
        async item => {
            await sleep(item.processDuration);
            finished++;
            return item.message;
        },
        { concurrency: 5 },
    );

    for (let i = 0; i < 10; i++) {
        processor.addToQueue({ processDuration: i * 10, index: i, message: `msg ${i}` });
        t.truthy(processor.running <= 5);
    }
    await processor.finish();
    t.is(finished, 10);
});

test('add running', async t => {
    let finished = 0;
    const processor: QueueProcessor<ITest> = new QueueProcessor<ITest>(
        async item => {
            await sleep(item.processDuration);
            finished++;
            return item.message;
        },
        { concurrency: 5 },
    );

    for (let i = 0; i < 10; i++) {
        await processor.addRunning({ processDuration: i * 10, index: i, message: `msg ${i}` });
        t.truthy(processor.running <= 5);
    }
    await processor.finish();
    t.is(finished, 10);
});

test('mixed usage', async t => {
    const processor: QueueProcessor<number> = new QueueProcessor<number>(sleep, { concurrency: 3 });

    processor.addToQueue(200);
    t.is(processor.running, 1);
    await processor.addRunning(200);
    t.is(processor.running, 2);
    processor.addToQueue(1);
    t.is(processor.running, 3);
    await sleep(10);
    t.is(processor.running, 2);
    await processor.addRunning(100);
    t.is(processor.running, 3);
    await processor.addRunning(100);
    t.is(processor.running, 3);
    processor.addToQueue(100);
    t.is(processor.running, 3);

    await processor.finish();
});

test('handles', async t => {
    let success = 0,
        fail = 0;
    const processor: QueueProcessor<ITest> = new QueueProcessor<ITest>(
        async item => {
            if (item.index === 3) throw new Error('error');
            await sleep(item.processDuration);
            return item.message;
        },
        {
            concurrency: 5,
            handleResult: (r, item) => {
                success++;
                t.is(r, item.message);
            },
            handleError: (e, item) => {
                fail++;
                t.deepEqual(
                    { e, item },
                    { e: new Error('error'), item: { processDuration: 10, index: 3, message: `msg ${3}` } },
                );
            },
        },
    );

    processor.addToQueue({ processDuration: 5, index: 0, message: `msg ${0}` });
    processor.addToQueue({ processDuration: 5, index: 1, message: `msg ${1}` });
    processor.addToQueue({ processDuration: 5, index: 2, message: `msg ${2}` });
    processor.addToQueue({ processDuration: 10, index: 3, message: `msg ${3}` });

    await processor.finish();
    t.is(success, 3);
    t.is(fail, 1);
});

test('priority', async t => {
    let output = [];

    const processor: QueueProcessor<ITest> = new QueueProcessor<ITest>(
        async item => await sleep(item.processDuration),
        { concurrency: 2, handleResult: (r, i) => output.push(i.message) },
    );

    processor.addToQueue({ processDuration: 100, index: 0, message: `0` });
    processor.addToQueue({ processDuration: 10, index: 1, message: `1` });
    processor.addToQueue({ processDuration: 10, index: 2, message: `2` });
    processor.addToQueue({ processDuration: 10, index: 3, message: `3` });

    await processor.addRunning({ processDuration: 10, index: -1, message: `high priority` });
    await processor.finish();

    t.deepEqual(output, ['1', 'high priority', '2', '3', '0']);
});

test('concurrency change', async t => {
    const processor: QueueProcessor<ITest> = new QueueProcessor<ITest>(async item => await sleep(item.processDuration));
    t.is(processor.concurrency, 1);
    processor.concurrency = 3;
    t.is(processor.concurrency, 3);
});
