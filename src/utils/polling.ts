type PollOptions = { pollTimeoutInMs?: number; pollIntervalInMs?: number };

export async function poll<T>(
    pollFn: () => T | Promise<T>,
    predicate: (value: T) => boolean,
    { pollTimeoutInMs, pollIntervalInMs }: PollOptions = { pollTimeoutInMs: 10_000, pollIntervalInMs: 500 },
): Promise<T> {
    if (pollTimeoutInMs < 2000) throw new Error('Polling timeout has to be at least 2000 ms');
    if (pollIntervalInMs < 500) throw new Error('Polling interval has to be at least 500 ms');

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            clearTimers(poller, timeout);
            reject(new Error('Timed out.'));
        }, pollTimeoutInMs);

        const poller = setInterval(async () => {
            try {
                const pollResult = await pollFn();

                if (!!predicate(pollResult)) {
                    clearTimers(poller, timeout);
                    resolve(pollResult);
                }
            } catch (e) {
                clearTimers(poller, timeout);
                reject(e);
            }
        }, pollIntervalInMs);
    });
}

function clearTimers(poller: NodeJS.Timeout, timeout: NodeJS.Timeout) {
    clearTimeout(timeout);
    clearInterval(poller);
}
