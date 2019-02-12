export function aggregate(count: number) {
    async function* _aggregate<T>(iterator: AsyncIterableIterator<T> | IterableIterator<T>): AsyncIterableIterator<T[]> {
        let result: T[] = [];
        for await (const item of iterator) {
            result.push(item);
            if (result.length >= count) {
                yield result;
                result = [];
            }
        }
        if (result.length > 0) {
            yield result;
        }
    }

    return _aggregate;
}
