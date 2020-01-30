import { sleep } from '../utils';

export async function runConcurrentJobs(
    concurrency: number,
    job: () => Promise<void>,
    limit: number = 0,
    exceptionCatch: (e) => void = e => {},
    updateConcurrencyJob: () => Promise<number> = null,
    updateConcurrencyPeriod_ms: number = 600000,
    tickTime_ms: number = 1000,
) {
    if (tickTime_ms < 1) throw 'tickTime_ms must be an integer greater than 0';
    let counter = 0;
    let nextConcurrencyUpdateAt = new Date().getTime() + updateConcurrencyPeriod_ms;
    let infinite = limit == 0;
    while (infinite || limit-- > 0) {
        if (counter < concurrency) {
            counter++;
            job()
                .catch(exceptionCatch)
                .finally(() => counter--);
        }
        await sleep(tickTime_ms);
        if (updateConcurrencyJob != null && new Date().getTime() > nextConcurrencyUpdateAt) {
            nextConcurrencyUpdateAt += updateConcurrencyPeriod_ms;
            concurrency = await updateConcurrencyJob();
        }
    }
}
