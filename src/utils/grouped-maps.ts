import { Dict } from '../types';

// toGroupedMaps - puts an array of objects into a map of maps

// example:

// source:
// [{g:"group1", k: "key1"},
//  {g:"group2", k: "key1"},
//  {g:"group2", k: "key2"}]

// result:
// {
//  "group1": {
//      "key1": <getValue result>
//    },
//  "group2": {
//      "key1": <getValue result>,
//      "key2": <getValue result>
//    }
// }

export function toGroupedMaps<T, U, V>(
    objects: T[],
    getItems: (a: T) => U[],
    getGroup: (a: T, b: U) => string,
    getKey: (a: U) => string,
    getValue: (a: T, b: U) => V,
): Dict<Dict<V, string>, string> {
    let result = {};
    for (let object of objects) {
        let items: U[] = getItems(object);
        for (let item of items) {
            let group = getGroup(object, item);
            let key = getKey(item);
            let value = getValue(object, item);
            if (!result[group]) result[group] = { [key]: value };
            else result[group][key] = value;
        }
    }
    return result;
}

// handleGroupedMaps - goes through a map of maps and makes requests for each group and its keys of the group
//                    then handles the result for each request

// example:

// source:
// {
//  "group1": {
//      "key1": <getValue result>
//    },
//  "group2": {
//      "key1": <getValue result>,
//      "key2": <getValue result>
//    }
// }

// requests:
// ("group1", ["key1"])
// ("group2", ["key1","key2"])

export async function handleGroupedMaps<T, U>(
    groupedMap: Dict<Dict<T, string>, string>,
    fetch: (group: string, keys: string[]) => Promise<U[]>,
    handle: (group: string, item: U) => void,
) {
    for (let group of Object.keys(groupedMap)) {
        let mapKeys = Object.keys(groupedMap[group]);
        let fetchedItems = await fetch(group, mapKeys);
        for (let item of fetchedItems) {
            handle(group, item);
        }
    }
}
