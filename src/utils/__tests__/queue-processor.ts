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

test.serial('priority', async t => {
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

test('correct execution order', async t => {
    const log = [];
    const processor: QueueProcessor<ITest> = new QueueProcessor<ITest>(
        async item => {
            await sleep(item.processDuration);
            log.push(`#${item.index} finished`);
        },
        {
            concurrency: 3,
            handleResult: (r, item) => {
                log.push(`#${item.index} result handled`);
            },
        },
    );

    log.push(`started filling queue`);

    for (let i = 0; i < 5; i++) {
        log.push(`adding #${i}`);
        processor.addToQueue({ processDuration: 10, index: i, message: `msg ${i}` });
        log.push(`added #${i}`);
    }

    log.push(`finished filling queue`);
    await processor.finish();
    log.push(`queue finished`);

    t.deepEqual(log, [
        "started filling queue",
        "adding #0",
        "added #0",
        "adding #1",
        "added #1",
        "adding #2",
        "added #2",
        "adding #3",
        "added #3",
        "adding #4",
        "added #4",
        "finished filling queue",
        "#0 finished",
        "#0 result handled",
        "#1 finished",
        "#1 result handled",
        "#2 finished",
        "#2 result handled",
        "#3 finished",
        "#3 result handled",
        "#4 finished",
        "#4 result handled",
        "queue finished"
    ])
});
