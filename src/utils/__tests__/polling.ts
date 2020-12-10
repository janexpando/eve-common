import { test } from '../../testing';
import { poll } from '../polling';

function createPollFn(returnDoneAfterMs = 2000) {
    const threshold = Date.now() + returnDoneAfterMs;

    return async () => ({
        id: '123',
        status: Date.now() >= threshold ? 'Done' : 'Pending',
    });
}

test('polling for resource state using predicate resolves', async t => {
    // arrange
    const getMockResource = createPollFn(2800);

    // act
    const result = await poll(getMockResource, mockResource => mockResource.status === 'Done', {
        pollIntervalInMs: 500,
        pollTimeoutInMs: 3100,
    });

    // assert
    t.deepEqual(result, { id: '123', status: 'Done' });
});

test('polling with low poll interval throws', async t => {
    // arrange, act & assert
    await t.throwsAsync(
        () =>
            poll(
                () => null,
                nullObject => !!nullObject,
                { pollIntervalInMs: 499 },
            ),
        /interval/,
    );
});

test('polling with low poll timeout throws', async t => {
    // arrange, act & assert
    await t.throwsAsync(
        () =>
            poll(
                () => null,
                nullObject => !!nullObject,
                { pollTimeoutInMs: 1999 },
            ),
        /timeout/,
    );
});

test('polling rejects if the underlying `pollFn` throws', async t => {
    // arrange, act & assert
    await t.throwsAsync(
        () =>
            poll(
                () => {
                    throw new Error("500: Couldn't fetch mock resource");
                },
                nullObject => !!nullObject,
            ),
        /fetch mock resource/,
    );
});

test('polling for resource state times out', async t => {
    // arrange
    const getMockResource = createPollFn(60_000);

    // act & assert
    await t.throwsAsync(
        () =>
            poll(
                () => getMockResource(),
                mockResource => mockResource.status === 'Done',
                { pollTimeoutInMs: 2000 },
            ),
        /Timed out/,
    );
});
