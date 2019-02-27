import {provideInjector, test} from "../../testing";
import {JobQueue} from "../job-queue";
import {prepareDB} from "../../testing/prepare-db";
import {DbDriver, ENVIRONMENT_PROVIDER, sleep} from "../..";
import {createLogger} from "winston";

provideInjector(test, [ENVIRONMENT_PROVIDER,
    DbDriver,
    {provide: 'winston_logger', useValue: createLogger()},
    {provide: JobQueue, useValue: new JobQueue('test')}
]);
prepareDB(test);

test.serial('job version is increasing', async t => {

    interface Abc {
        param: string;
    }

    let queue = t.context.injector.get(JobQueue) as JobQueue<Abc>;

    await queue.add({param: '123'});
    await queue.add({param: '1234'});
    await queue.add({param: '12345'});
    let job = await queue.take();
    t.is(job.payload.param, '123');
});

test.serial.skip('exactly once delivery', async t => {
    let queue = t.context.injector.get<JobQueue<{ id: number }>>(JobQueue);
    for (let i = 0; i < 100; i++) {
        await queue.add({id: i});
    }
    let promises = [];
    for (let i = 0; i < 100; i++) {
        promises.push(queue.add({id: i}));
    }
    await Promise.all(promises);
    await sleep(1000);
    let versions = new Set();
    promises = [];
    let ids = new Set();
    for (let i = 0; i < 100; i++) {
        let p = queue.take().then(value => {
            ids.add(value.payload.id);
            versions.add(value.version);
        }).catch(reason => t.fail(reason));
        promises.push(p);
    }
    await Promise.all(promises);
    t.is(ids.size, 100);
    t.is(versions.size, 100);
});
