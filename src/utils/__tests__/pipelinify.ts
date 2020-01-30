import { test } from '../../testing';
import { PipeFunction, pipelinify } from '../pipelinify';

test('normal pipeline run', async t => {
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
        t.deepEqual(item, [1, 2, 3, 4]);
    };

    await pipelinify([pipeFn1, 2, pipeFn2, 4, pipeFn3]);
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
