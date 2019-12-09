import {test} from "../../testing";
import {sleep} from "../../utils";
import {runConcurrentJobs} from "../concurrency";

test('run concurrent jobs', async t => {
    let count = 0;
    let concurrency = 3;
    let job = async () => {
        count++;
        if (count > concurrency)
            t.fail('concurrency exceeded');
        await sleep(100);
        count--;
    };
    let updateConcurrency = async () => {
        await sleep(60);
        concurrency = 6;
        return 6;
    };

    await runConcurrentJobs(concurrency, job, 50, null, updateConcurrency, 80, 5);
    t.pass();
});
