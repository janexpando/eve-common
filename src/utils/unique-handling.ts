// I DARE YOU NOT QUESTION THIS FUNCTION !
import {chunkArray} from "./chunk-array";

export async function requestUniqueElements<T, G, V, R>(
    items: T[],
    getGroup: (t: T) => G,
    getValue: (t: T) => V,
    getResult: (v: V[], g: G) => Promise<R[]>,
    canRequest: (v: V) => boolean = (v) => true,
    maxRequestChunkSize: number = 0,
): Promise<R[]> {
    let compressedValues: Map<G, Map<V, number[]>> = new Map<G, Map<V, number[]>>();
    for (let i = 0; i < items.length; i++) // removing duplicites
    {
        let item: T = items[i];
        let group: G = getGroup(item);
        let value: V = getValue(item);

        let g: Map<V, number[]> = compressedValues.get(group);
        if (g) {
            let k: number[] = g.get(value);
            if (k)
                k.push(i);
            else
                g.set(value, [i]);
        } else
            compressedValues.set(group, new Map<V, number[]>([[value, [i]]]));
    }

    let groups = [...compressedValues.keys()];
    let orderedResults: R[] = new Array<R>(items.length);
    for (let group of groups) {
        let requestValues: V[] = [...compressedValues.get(group).keys()].filter(x => canRequest(x));
        if (requestValues.length == 0)
            continue;

        let requestChunks: V[][] = maxRequestChunkSize ? chunkArray(requestValues, maxRequestChunkSize) : [requestValues];
        for (let requestChunkValues of requestChunks) {
            let requestResult: R[] = await getResult(requestChunkValues, group);

            for (let k = 0; k < requestChunkValues.length; k++) // uncompressing duplicites and pairing them up with results
            {
                let value: V = requestChunkValues[k];
                let valueArray = compressedValues.get(group).get(value);
                for (let l = 0; l < valueArray.length; l++) {
                    let index = valueArray[l];
                    orderedResults[index] = requestResult[k];
                }
            }
        }
    }

    return orderedResults;
}

// ORIGINAL C# VERSION

/// <summary>
/// Complex function for requests where only unique items are requested and are divided by groups based on their type for each request and then are sorted in order as they were requested.
/// </summary>
/// <typeparam name="T">Object type with information</typeparam>
/// <typeparam name="V">Atomic information type for request</typeparam>
/// <typeparam name="G">Group type</typeparam>
/// <typeparam name="R">Result type</typeparam>
/// <param name="items">Standard collection with requested items.</param>
/// <param name="getResult">The request itself.</param>
/// <param name="getGroup">Deciding function how to divide items to groups.</param>
/// <param name="getKey">Item-converting function for request itself.</param>
/// <returns>Sorted result from the getResult function.</returns>
/*
private List<R> RequestUniqueElements<T, V, G, R>(List<T> items, Func<List<V>, G, List<R>> getResult, Func<T,G> getGroup, Func<T, V> getKey)
{
    Dictionary<G, Dictionary<V, List<int>>> compressedKeys = new Dictionary<G, Dictionary<V, List<int>>>();
    for (int k = 0; k < items.Count; k++) // removing duplicites
    {
        T item = items[k];
        G group = getGroup.Invoke(item);
        V key = getKey(item);

        if (compressedKeys.ContainsKey(group))
        {
            if (compressedKeys[group].ContainsKey(key))
                compressedKeys[group][key].Add(k);
            else
                compressedKeys[group][key] = new List<int>() { k };
        }
        else
            compressedKeys[group] = new Dictionary<V, List<int>>() { { key, new List<int>() { k } } };
    }

    R[] orderedResults = new R[items.Count];
    foreach (G group in compressedKeys.Keys)
    {
        List<V> requestKeys = compressedKeys[group].Keys.ToList();
        List<R> requestResult = getResult(requestKeys, group);

        for (int k = 0; k < requestKeys.Count; k++) // uncompressing duplicites and pairing them up with results
        {
            V key = requestKeys[k];
            for (int l = 0; l < compressedKeys[group][key].Count; l++)
            {
                int index = compressedKeys[group][key][l];
                orderedResults[index] = requestResult[k];
            }
        }
    }

    return orderedResults.ToList();
}
*/