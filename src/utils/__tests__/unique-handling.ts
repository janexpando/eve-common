import { test } from '../../testing';
import { requestUniqueElements } from '../unique-handling';

test('grouping, filtering and requesting unique, chunked elements', async t => {
    let values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    let expectedResult = [
        0,
        1.5,
        1,
        2.5,
        2,
        3.5,
        3,
        4.5,
        4,
        5.5,
        undefined,
        undefined,
        undefined,
        5.5,
        4,
        4.5,
        3,
        3.5,
        2,
        2.5,
        1,
        1.5,
        0,
    ];
    let requestedValuesTemplate = [[0, 2], [4, 6], [8], [1, 3], [5, 7], [9]];
    let requestedValues = [];
    let requestedGroupsTemplate = [0, 0, 0, 1, 1, 1];
    let requestedGroups = [];

    let getResult = async (values: number[], group: number): Promise<number[]> => {
        requestedValues.push(values);
        requestedGroups.push(group);
        return values.map(x => x / 2 + group);
    };

    let result = await requestUniqueElements<number, number, number, number>(
        values,
        n => n % 2,
        n => n,
        (values, group) => getResult(values, group),
        n => n < 10,
        2,
    );

    t.deepEqual(requestedGroups, requestedGroupsTemplate);
    t.deepEqual(requestedValues, requestedValuesTemplate);
    t.deepEqual(result, expectedResult);
});

test('grouping and requesting unique elements', async t => {
    let values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    let expectedResult = [0, 1.5, 1, 2.5, 2, 3.5, 3, 4.5, 4, 5.5, 5, 6.5, 5, 5.5, 4, 4.5, 3, 3.5, 2, 2.5, 1, 1.5, 0];
    let requestedValuesTemplate = [
        [0, 2, 4, 6, 8, 10],
        [1, 3, 5, 7, 9, 11],
    ];
    let requestedValues = [];
    let requestedGroupsTemplate = [0, 1];
    let requestedGroups = [];

    let getResult = async (values: number[], group: number): Promise<number[]> => {
        requestedValues.push(values);
        requestedGroups.push(group);
        return values.map(x => x / 2 + group);
    };

    let result = await requestUniqueElements<number, number, number, number>(
        values,
        n => n % 2,
        n => n,
        (values, group) => getResult(values, group),
    );

    t.deepEqual(requestedGroups, requestedGroupsTemplate);
    t.deepEqual(requestedValues, requestedValuesTemplate);
    t.deepEqual(result, expectedResult);
});
