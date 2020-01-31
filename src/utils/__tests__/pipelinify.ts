import { test } from '../../testing';
import { PipeFunction, pipelinify } from '../pipelinify';
import {sleep} from "../../utils";

test('normal pipeline run', async t => {
    let countA = 0, countB = 0, countC = 0;
    let pipeFn1: PipeFunction = async (item, push) => {
        countA++;
        for (let a of [1, 2, 3, 4]) {
            push(a);
        }
    };
    let pipeFn2: PipeFunction = async (item: number[], push) => {
        countB++;
        for (let a of item) {
            push(a);
        }
    };
    let pipeFn3: PipeFunction = async (item, push) => {
        countC++;
        t.deepEqual(item, [1, 2, 3, 4]);
    };

    await pipelinify([pipeFn1, 2, pipeFn2, 4, pipeFn3]);
    t.is(countA, 1);
    t.is(countB, 2);
    t.is(countC, 1);
    t.pass();
});

test('error pipeline run', async t => {
    let pipeFn1: PipeFunction = async (item, push) => {
        for (let a of [1, 2, 3, 4]) {
            push(a);
        }
    };
    let pipeFn2: PipeFunction = async (item: number[], push) => {
        for (let a of item) {
            push(a);
        }
    };
    let pipeFn3: PipeFunction = async (item, push) => {
        throw 'error';
    };

    try {
        await pipelinify([pipeFn1, 2, pipeFn2, 4, pipeFn3]);
        t.fail();
    } catch (e) {
        t.is(e, 'error');
    }
});

test('normal async pipeline run', async t => {
    let countA = 0, countB = 0, countC = 0;
    let pipeFn1: PipeFunction = async (item, push) => {
        countA++;
        for (let a of [1, 2, 3, 4]) {
            await sleep(50);
            push(a);
        }
    };
    let pipeFn2: PipeFunction = async (item: number[], push) => {
        countB++;
        for (let a of item) {
            await sleep(50);
            push(a);
        }
    };
    let pipeFn3: PipeFunction = async (item, push) => {
        countC++;
        await sleep(50);
        t.deepEqual(item, [1, 2, 3, 4]);
    };

    await pipelinify([pipeFn1, 2, pipeFn2, 4, pipeFn3]);

    t.is(countA, 1);
    t.is(countB, 2);
    t.is(countC, 1);
    t.pass();
});