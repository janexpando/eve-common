import {
    getLastMonthStart,
    getLastWeekStart,
    getMidnight,
    getMonthStart,
    getWeekStart,
    getYesterdayMidnight,
} from '../time-bending';
import { test } from '../../testing';

test('get yesterday', t => {
    let result = getYesterdayMidnight(new Date('2019-01-21T12:00:00Z'));
    t.is(result.getTime(), new Date('2019-01-20').getTime());

    result = getYesterdayMidnight(new Date('2019-01-01T09:09:00Z'));
    t.is(result.getTime(), new Date('2018-12-31').getTime());
});

test('get midnight', t => {
    t.is(getMidnight(new Date('2019-01-01T19:00:00Z')).getTime(), new Date('2019-01-01T00:00:00Z').getTime());
});

test('get last week start', t => {
    let lastWeekStart = getLastWeekStart(new Date('2019-02-01T12:05:10.000Z'));
    t.is(lastWeekStart.toISOString(), '2019-01-21T00:00:00.000Z');
});

test('get week start', t => {
    let start = getWeekStart(new Date('2019-02-01T12:05:10.000Z'));
    t.is(start.toISOString(), '2019-01-28T00:00:00.000Z');
});

test('get month start', t => {
    let start = getMonthStart(new Date('2019-02-15T12:05:10.000Z'));
    t.is(start.toISOString(), '2019-02-01T00:00:00.000Z');
});

test('get last month start', t => {
    let start = getLastMonthStart(new Date('2019-02-15T12:05:10.000Z'));
    t.is(start.toISOString(), '2019-01-01T00:00:00.000Z');
});

test('get last month start - year leap', t => {
    let start = getLastMonthStart(new Date('2019-01-15T12:05:10.000Z'));
    t.is(start.toISOString(), '2018-12-01T00:00:00.000Z');
});
