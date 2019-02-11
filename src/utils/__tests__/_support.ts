export function* generate(): IterableIterator<number> {
    for (let i = 0; i < 10; i++) yield i;
}

export async function* generateAsync(): AsyncIterableIterator<number> {
    for (let i = 0; i < 10; i++) yield await i;
}
