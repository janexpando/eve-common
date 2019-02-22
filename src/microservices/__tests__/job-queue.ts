import {test} from "../../testing";
import {JobQueue} from "../job-queue";
import {sleep} from "../../utils";


test('t', async t => {

    interface abc {
        param: string;
    }

    let queue = new JobQueue<abc>('test');

    await queue.add({param: '123'});
    await sleep(10);
    await queue.add({param: '1234'});
    await sleep(10);
    await queue.add({param: '12345'});

    let job = await queue.take();
    t.is(job.payload.param, '123');
});