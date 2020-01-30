export async function iteratorToArray<T>(iterator: AsyncIterableIterator<T> | IterableIterator<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const item of iterator) {
        result.push(item);
    }
    return result;
}
