import {provideInjector, test} from "../../testing";
import {JobQueue} from "../job-queue";
import {prepareDB} from "../../testing/prepare-db";
import {DbDriver, ENVIRONMENT_PROVIDER} from "../..";
import {Logger, createLogger} from "winston";

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

test.serial.skip('exacly once delivery', async t => {
    let queue = t.context.injector.get(JobQueue);
    for (let i = 0; i < 100; i++) {
        queue.add({id: i});
    }
    let promises = [];
    for (let i = 0; i < 100; i++) {
        queue.add({id: i});
    }


    let results = await Promise.all(promises);
    t.log(results);
    t.pass();

});
