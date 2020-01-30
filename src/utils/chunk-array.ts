export function chunkArray(array: any[], chunkSize): any[][] {
    let results = [];

    while (array.length) {
        results.push(array.splice(0, chunkSize));
    }

    return results;
}
