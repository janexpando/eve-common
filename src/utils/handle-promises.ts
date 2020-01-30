export async function handlePromises<T>(promises: Promise<T>[]): Promise<{ result: T; error: Error }[]> {
    // TODO tests
    let packedPromises = promises.map(p => {
        return p
            .then(r => {
                return { result: r, error: null };
            })
            .catch(e => {
                return { result: null, error: e };
            });
    });
    return await Promise.all(packedPromises);
}
