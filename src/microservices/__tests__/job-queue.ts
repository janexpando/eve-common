import {prepareDB, provideInjector, test} from "../../testing";
import {getJobState, JobQueue} from "../job-queue";
import {SECOND, sleep} from "../..";


provideInjector(test, [{provide: JobQueue, useValue: new JobQueue('test')}
]);
prepareDB(test);

test.serial('job version is increasing', async t => {

    interface Abc {
        param: string;
    }

    let queue = t.context.injector.get(JobQueue) as JobQueue<Abc>;

    let {_id: jobId} = await queue.add({param: '123'});
    await queue.add({param: '1234'});
    await queue.add({param: '12345'});
    t.is(getJobState(await queue.get(jobId)), 'queued');
    t.is(await queue.waitingJobsCount(), 3);
    let job = await queue.take(10 * SECOND);
    t.is(await queue.waitingJobsCount(), 2);
    t.is(job.payload.param, '123');
    t.is(getJobState(await queue.get(jobId)), 'processing');
    await queue.markFinished(job._id);
    t.is(getJobState(await queue.get(jobId)), 'finished');
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
    await sleep(SECOND);
    let versions = new Set();
    promises = [];
    let ids = new Set();
    for (let i = 0; i < 100; i++) {
        let p = queue.take(SECOND).then(value => {
            if (!value) {
                i--;
                return;
            }
            ids.add(value.payload.id);
            versions.add(value.version);
        }).catch(reason => t.fail(reason));
        promises.push(p);
    }
    await Promise.all(promises);
    t.is(ids.size, 100);
    t.is(versions.size, 100);
});

test.serial('job timeout', async t => {
    let queue = t.context.injector.get(JobQueue) as JobQueue<any>;
    let {_id} = await queue.add({});
    await queue.take(2);
    await sleep(10);
    let job = await queue.get(_id);
    t.is(getJobState(job), 'timeout');
});
