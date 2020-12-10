type PollOptions = { pollTimeoutInMs?: number; pollIntervalInMs?: number };

export async function poll<T>(
    pollFn: () => T | Promise<T>,
    predicate: (value: T) => boolean,
    { pollTimeoutInMs, pollIntervalInMs }: PollOptions = { pollTimeoutInMs: 10_000, pollIntervalInMs: 500 },
): Promise<T> {
    if (pollTimeoutInMs < 2000) throw new Error('Polling timeout has to be at least 2000 ms');
    if (pollIntervalInMs < 500) throw new Error('Polling interval has to be at least 500 ms');

    const clearTimers = (poller, timer) => {
        clearTimeout(timer);
        clearInterval(poller);
    };

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            clearTimers(poller, timer);
            reject(new Error('Timed out.'));
        }, pollTimeoutInMs);

        const poller = setInterval(async () => {
            try {
                const pollResult = await pollFn();

                if (!!predicate(pollResult)) {
                    clearTimers(poller, timer);
                    resolve(pollResult);
                }
            } catch (e) {
                clearTimers(poller, timer);
                reject(e);
            }
        }, pollIntervalInMs);
    });
}
